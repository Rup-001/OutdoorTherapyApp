const { z } = require('zod');

const createTermsConditions = {
  body: z.object({
    content: z.string().min(1),
  }),
};

const getTermsConditions = {
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
  }),
};

const updateTermsConditions = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};

const deleteTermsConditions = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

module.exports = {
  createTermsConditions,
  getTermsConditions,
  updateTermsConditions,
  deleteTermsConditions,
};
