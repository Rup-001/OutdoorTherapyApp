const { z } = require('zod');

const cmsSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

const createCms = { body: cmsSchema };
const updateCms = {
  params: z.object({ id: z.string().uuid() }),
  body: cmsSchema.partial(),
};
const getCmsById = {
  params: z.object({ id: z.string().uuid() }),
};

module.exports = {
  createCms,
  updateCms,
  getCmsById,
};
