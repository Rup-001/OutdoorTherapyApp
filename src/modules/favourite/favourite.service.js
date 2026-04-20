const httpStatus = require('http-status');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { getSignedFileUrl } = require('../../services/r2.service');

/**
 * Toggle favourite (Add if not exists, remove if exists)
 * @param {string} userId
 * @param {string} trackId
 * @returns {Promise<Object>}
 */
const toggleFavourite = async (userId, trackId) => {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
  });

  if (!track) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Track not found');
  }

  const existingFavourite = await prisma.favourite.findUnique({
    where: {
      userId_trackId: {
        userId,
        trackId,
      },
    },
  });

  if (existingFavourite) {
    await prisma.favourite.delete({
      where: {
        id: existingFavourite.id,
      },
    });
    return { message: 'Removed from favourites', isFavourite: false };
  }

  await prisma.favourite.create({
    data: {
      userId,
      trackId,
    },
  });

  return { message: 'Added to favourites', isFavourite: true };
};

/**
 * Get user's favourite tracks
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getFavourites = async (userId, options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, favourites] = await Promise.all([
    prisma.favourite.count({ where: { userId } }),
    prisma.favourite.findMany({
      where: { userId },
      include: {
        track: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  const mappedTracks = await Promise.all(favourites.map(async (f) => ({
    ...f.track,
    audioUrl: await getSignedFileUrl(f.track.audioUrl),
    coverImageUrl: await getSignedFileUrl(f.track.coverImageUrl),
  })));

  return {
    data: mappedTracks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  toggleFavourite,
  getFavourites,
};
