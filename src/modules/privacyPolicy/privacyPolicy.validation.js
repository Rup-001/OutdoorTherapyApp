const { z } = require('zod');

const createPrivacyPolicy = {
  body: z.object({
    content: z.string().min(1),
  }),
};

const getPrivacyPolicies = {
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
  }),
};

const updatePrivacyPolicy = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};

const deletePrivacyPolicy = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

module.exports = {
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
