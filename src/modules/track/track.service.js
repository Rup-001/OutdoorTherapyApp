const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../../utils/ApiError');

const prisma = new PrismaClient();

/**
 * Create a track
 * @param {Object} trackBody
 * @returns {Promise<Track>}
 */
const createTrack = async (trackBody) => {
  return prisma.track.create({
    data: trackBody,
  });
};

/**
 * Query for tracks
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTracks = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const skip = (page - 1) * limit;

  let orderBy = { createdAt: 'desc' };
  if (sortBy) {
    const [field, order] = sortBy.split(':');
    orderBy = { [field]: order };
  }

  const tracks = await prisma.track.findMany({
    where: filter,
    take: limit,
    skip: skip,
    orderBy: orderBy,
    include: {
      category: {
        select: { name: true }
      }
    }
  });

  const totalResults = await prisma.track.count({ where: filter });
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: tracks,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get track by id
 * @param {string} id
 * @returns {Promise<Track>}
 */
const getTrackById = async (id) => {
  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      category: true
    }
  });
  if (!track) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Track not found');
  }
  return track;
};

/**
 * Update track by id
 * @param {string} trackId
 * @param {Object} updateBody
 * @returns {Promise<Track>}
 */
const updateTrackById = async (trackId, updateBody) => {
  const track = await getTrackById(trackId);
  
  const updatedTrack = await prisma.track.update({
    where: { id: track.id },
    data: updateBody,
  });

  return updatedTrack;
};

/**
 * Delete track by id
 * @param {string} trackId
 * @returns {Promise<Track>}
 */
const deleteTrackById = async (trackId) => {
  const track = await getTrackById(trackId);
  
  await prisma.track.delete({
    where: { id: track.id },
  });

  return track;
};

module.exports = {
  createTrack,
  queryTracks,
  getTrackById,
  updateTrackById,
  deleteTrackById,
};
