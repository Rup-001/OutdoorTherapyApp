const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../../utils/ApiError');
const fs = require('fs');

const prisma = new PrismaClient();

/**
 * Helper function to delete files from local storage
 * @param {string} filePath 
 */
const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete local file: ${filePath}`, err);
    }
  }
};

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

  const where = {};
  if (filter.title) {
    where.title = { contains: filter.title, mode: 'insensitive' };
  }
  if (filter.categoryId) {
    where.categoryId = filter.categoryId;
  }
  if (filter.isFeatured !== undefined) {
    where.isFeatured = filter.isFeatured === 'true';
  }
  if (filter.isSleepTonight !== undefined) {
    where.isSleepTonight = filter.isSleepTonight === 'true';
  }

  const tracks = await prisma.track.findMany({
    where,
    take: Number(limit),
    skip: skip,
    orderBy: orderBy,
    include: {
      category: {
        select: { name: true }
      }
    }
  });

  const totalResults = await prisma.track.count({ where });
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: tracks,
    page: Number(page),
    limit: Number(limit),
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
      category: {
        select: { name: true }
      }
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
  
  // Cleanup old files if new ones are uploaded
  if (updateBody.audioUrl && track.audioUrl && updateBody.audioUrl !== track.audioUrl) {
    deleteLocalFile(track.audioUrl);
  }
  if (updateBody.coverImageUrl && track.coverImageUrl && updateBody.coverImageUrl !== track.coverImageUrl) {
    deleteLocalFile(track.coverImageUrl);
  }

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
  
  // Cleanup files
  deleteLocalFile(track.audioUrl);
  deleteLocalFile(track.coverImageUrl);

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
