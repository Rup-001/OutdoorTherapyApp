const { z } = require('zod');

const startDownload = {
  params: z.object({
    trackId: z.string().uuid(),
  }),
};

const updateStatus = {
  params: z.object({
    downloadId: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'DOWNLOADING', 'COMPLETED', 'FAILED']).optional(),
    progressPercent: z.number().int().min(0).max(100).optional(),
  }),
};

const deleteDownload = {
  params: z.object({
    downloadId: z.string().uuid(),
  }),
};

module.exports = {
  startDownload,
  updateStatus,
  deleteDownload,
};
