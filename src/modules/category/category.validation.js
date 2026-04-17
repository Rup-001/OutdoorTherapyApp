const { z } = require('zod');

const createCategory = {
  body: z.object({
    name: z.string().min(1, "Name is required"),
  }),
};

const getCategories = {
  query: z.object({
    name: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().default(10)),
    page: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().default(1)),
  }),
};

const getCategory = {
  params: z.object({
    categoryId: z.string().uuid(),
  }),
};

const updateCategory = {
  params: z.object({
    categoryId: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
  }).partial(),
};

const deleteCategory = {
  params: z.object({
    categoryId: z.string().uuid(),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
