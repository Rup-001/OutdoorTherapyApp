const { z } = require('zod');

const updatePlayHistory = {
  body: z.object({
    trackId: z.string().uuid(),
    playedSeconds: z.number().int().min(0),
  }),
};

module.exports = {
  updatePlayHistory,
};
