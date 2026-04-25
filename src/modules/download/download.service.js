const httpStatus = require('http-status');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { getSignedFileUrl } = require('../../services/r2.service');

/**
 * Start a download (Check limit and create PENDING record)
 * @param {string} userId
 * @param {string} trackId
 * @returns {Promise<Object>}
 */
const startDownload = async (userId, trackId) => {
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    include: { 
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { plan: true },
        take: 1
      }
    }
  });
  const track = await prisma.track.findUnique({ where: { id: trackId } });

  if (!track) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Track not found');
  }

  // Handle limits based on User Type
  if (user.userType === 'FREE') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Downloads are not available for Free users. Please upgrade to a plan.');
  }

  if (user.userType === 'BASIC') {
    const activeSub = user.subscriptions[0];
    const maxLimit = activeSub?.plan?.downloadLimit || 3;

    const completedDownloadsCount = await prisma.download.count({
      where: { userId, status: 'COMPLETED' },
    });

    if (completedDownloadsCount >= maxLimit) {
      throw new ApiError(httpStatus.FORBIDDEN, `Download limit reached for Basic plan (${maxLimit}). Upgrade to Premium for unlimited downloads.`);
    }
  }

  // PREMIUM users have no check here, logic proceeds

  // Check if download record already exists
  const existingDownload = await prisma.download.findFirst({
    where: { userId, trackId },
  });

  let result;
  if (existingDownload) {
    // If it was failed or pending, reset it
    result = await prisma.download.update({
      where: { id: existingDownload.id },
      data: { status: 'PENDING', progressPercent: 0 },
      include: { track: true }
    });
  } else {
    result = await prisma.download.create({
      data: {
        userId,
        trackId,
        status: 'PENDING',
      },
      include: { track: true }
    });
  }

  // Generate signed URL for the download link
  const downloadUrl = await getSignedFileUrl(result.track.audioUrl);

  return {
    ...result,
    downloadUrl
  };
};

/**
 * Update download status/progress
 */
const updateDownloadStatus = async (downloadId, userId, updateBody) => {
  const download = await prisma.download.findUnique({
    where: { id: downloadId },
  });

  if (!download || download.userId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Download record not found');
  }

  return prisma.download.update({
    where: { id: downloadId },
    data: updateBody,
  });
};

/**
 * Get user's completed downloads
 */
const getMyDownloads = async (userId) => {
  const downloads = await prisma.download.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      track: {
        include: {
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Promise.all(downloads.map(async (item) => ({
    ...item,
    track: {
      ...item.track,
      audioUrl: await getSignedFileUrl(item.track.audioUrl),
      coverImageUrl: await getSignedFileUrl(item.track.coverImageUrl),
    }
  })));
};

/**
 * Delete a download record
 */
const deleteDownload = async (downloadId, userId) => {
  const download = await prisma.download.findUnique({
    where: { id: downloadId },
  });

  if (!download || download.userId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Download record not found');
  }

  return prisma.download.delete({
    where: { id: downloadId },
  });
};

module.exports = {
  startDownload,
  updateDownloadStatus,
  getMyDownloads,
  deleteDownload,
};
