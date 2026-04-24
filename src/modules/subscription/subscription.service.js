const httpStatus = require('http-status');
const Stripe = require('stripe');
const config = require('../../config/config');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { decrypt } = require('../../utils/crypto');

/**
 * Get dynamic Stripe client and config from Database
 */
const getStripeConfig = async () => {
  const settings = await prisma.appSettings.findFirst();
  
  if (!settings || !settings.stripeEnabled) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Stripe is currently disabled by administrator');
  }

  let secretKey = config.stripe.secretKey;
  if (settings.stripeSecretKey) {
    try {
      secretKey = decrypt(settings.stripeSecretKey);
    } catch (e) {
      console.error('Failed to decrypt Stripe Secret Key from DB');
    }
  }

  if (!secretKey) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Stripe Secret Key is not configured');
  }

  return {
    stripe: new Stripe(secretKey),
    settings
  };
};

/**
 * Get or create a Stripe customer for a user
 */
const getOrCreateCustomer = async (user) => {
  const { stripe } = await getStripeConfig();
  
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
  });

  if (subscription && subscription.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName || user.email,
    metadata: { userId: user.id },
  });

  return customer.id;
};

/**
 * Create Stripe Checkout Session for a specific Plan
 * @param {Object} user
 * @param {string} planId
 * @returns {Promise<string>}
 */
const createCheckoutSession = async (user, planId) => {
  const { stripe } = await getStripeConfig();
  
  // Fetch the selected plan
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId, isActive: true },
  });

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription plan not found or inactive');
  }

  const customerId = await getOrCreateCustomer(user);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${config.stripe.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.stripe.cancelUrl,
    metadata: { 
      userId: user.id,
      planId: plan.id
    },
  });

  return session.url;
};

/**
 * Get subscription status for a user
 */
const getSubscriptionStatus = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  });

  return {
    userType: user.userType,
    isPremium: user.userType === 'PREMIUM' || user.userType === 'ADMIN',
    subscription,
  };
};

/**
 * Handle Stripe Webhook Events
 */
const handleWebhook = async (rawBody, signature) => {
  const settings = await prisma.appSettings.findFirst();
  if (!settings) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'App settings not found');

  let webhookSecret = config.stripe.webhookSecret;
  if (settings.stripeWebhookSecret) {
    try {
      webhookSecret = decrypt(settings.stripeWebhookSecret);
    } catch (e) {
      console.error('Failed to decrypt Stripe Webhook Secret');
    }
  }

  let secretKey = config.stripe.secretKey;
  if (settings.stripeSecretKey) {
    try {
      secretKey = decrypt(settings.stripeSecretKey);
    } catch (e) {
      console.error('Failed to decrypt Stripe Secret Key');
    }
  }

  if (!webhookSecret || !secretKey) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stripe keys missing for webhook');
  }

  const stripe = new Stripe(secretKey);
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook Signature verification failed: ${err.message}`);
    throw new ApiError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSuccess(session, stripe);
      break;
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(session);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailure(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

/**
 * Handle successful checkout session
 */
const handleCheckoutSuccess = async (session, stripe) => {
  const userId = session.metadata.userId;
  const planId = session.metadata.planId;
  const stripeSubscriptionId = session.subscription;
  const stripeCustomerId = session.customer;

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  await prisma.subscription.create({
    data: {
      userId,
      planId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: 'ACTIVE',
      planType: 'PREMIUM',
      startDate: new Date(stripeSubscription.current_period_start * 1000),
      endDate: new Date(stripeSubscription.current_period_end * 1000),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { userType: 'PREMIUM' },
  });
};

/**
 * Handle subscription updates/cancellations
 */
const handleSubscriptionChange = async (subscription) => {
  const stripeSubscriptionId = subscription.id;
  const status = subscription.status === 'active' ? 'ACTIVE' : 'EXPIRED';

  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  if (dbSub) {
    await prisma.subscription.update({
      where: { id: dbSub.id },
      data: {
        status,
        endDate: new Date(subscription.current_period_end * 1000),
      },
    });

    if (status !== 'ACTIVE') {
      await prisma.user.update({
        where: { id: dbSub.userId },
        data: { userType: 'FREE' },
      });
    }
  }
};

/**
 * Handle payment failures
 */
const handlePaymentFailure = async (invoice) => {
  const stripeCustomerId = invoice.customer;
  const userSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId },
  });

  if (userSub) {
    await prisma.user.update({
      where: { id: userSub.userId },
      data: { userType: 'FREE' },
    });
  }
};

const getPlans = async (isAdmin = false) => {
  const where = isAdmin ? {} : { isActive: true };
  return prisma.subscriptionPlan.findMany({
    where,
    orderBy: { price: 'asc' },
  });
};

const createPlan = async (planBody) => {
  return prisma.subscriptionPlan.create({
    data: planBody,
  });
};

const updatePlan = async (planId, updateBody) => {
  return prisma.subscriptionPlan.update({
    where: { id: planId },
    data: updateBody,
  });
};

const deletePlan = async (planId) => {
  return prisma.subscriptionPlan.delete({
    where: { id: planId },
  });
};

module.exports = {
  createCheckoutSession,
  getSubscriptionStatus,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  handleWebhook,
};
