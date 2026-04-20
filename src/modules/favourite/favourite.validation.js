const { z } = require('zod');

const toggleFavourite = {
  params: z.object({
    trackId: z.string().uuid(),
  }),
};

const getFavourites = {
  query: z.object({
    page: z.preprocess((val) => (val ? parseInt(val, 10) : 1), z.number()),
    limit: z.preprocess((val) => (val ? parseInt(val, 10) : 10), z.number()),
  }),
};

module.exports = {
  toggleFavourite,
  getFavourites,
};
