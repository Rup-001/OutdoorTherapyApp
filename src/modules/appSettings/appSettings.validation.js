const { z } = require('zod');

const updateSettings = {
  body: z.object({
    appName: z.string().optional(),
    supportEmail: z.string().email().optional(),
    maxDownloadsFree: z.number().int().min(0).optional(),
    stripeEnabled: z.boolean().optional(),
    stripePublicKey: z.string().optional(),
    stripeSecretKey: z.string().optional(),
    paypalEnabled: z.boolean().optional(),
  }),
};

module.exports = {
  updateSettings,
};
