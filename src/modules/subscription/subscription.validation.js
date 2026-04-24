const { z } = require('zod');

const createCheckoutSession = {
  body: z.object({
    planId: z.string().uuid(),
  }),
};

const createPlan = {
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().positive(),
    currency: z.string().default('USD'),
    interval: z.enum(['month', 'year']),
    stripePriceId: z.string(),
    paypalPlanId: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
};

const updatePlan = {
  params: z.object({
    planId: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    interval: z.enum(['month', 'year']).optional(),
    stripePriceId: z.string().optional(),
    paypalPlanId: z.string().optional(),
    isActive: z.boolean().optional(),
  }).partial(),
};

const deletePlan = {
  params: z.object({
    planId: z.string().uuid(),
  }),
};

module.exports = {
  createCheckoutSession,
  createPlan,
  updatePlan,
  deletePlan,
};
