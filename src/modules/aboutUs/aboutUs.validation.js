const { z } = require('zod');

const createAboutUs = {
  body: z.object({
    content: z.string().min(1),
  }),
};

const getAboutUs = {
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
  }),
};

const updateAboutUs = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};

const deleteAboutUs = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
