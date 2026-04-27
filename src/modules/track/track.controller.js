const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { trackService } = require('./index');
const { getAudioDuration } = require('../../services/r2.service');
const response = require('../../config/response');

/**
 * Utility to extract relative file path
 */
const getFilePath = (file) => {
  if (!file) return null;
  // Prefer 'key' from multer-s3, otherwise use 'path' and normalize slashes
  const rawPath = file.key || file.path;
  return rawPath ? rawPath.replace(/\\/g, '/') : null;
};

const createTrack = catchAsync(async (req, res) => {
  const trackBody = {
    ...req.body,
  };

  if (req.files) {
    if (req.files.audio) {
      trackBody.audioUrl = getFilePath(req.files.audio[0]);
      // Automatic Duration Calculation
      if (!trackBody.durationSeconds) {
        const duration = await getAudioDuration(trackBody.audioUrl);
        if (duration) trackBody.durationSeconds = duration;
      }
    }
    if (req.files.coverImage) {
      trackBody.coverImageUrl = getFilePath(req.files.coverImage[0]);
    }
  }

  const track = await trackService.createTrack(trackBody);
  res.status(httpStatus.CREATED).send(
    response({
      code: httpStatus.CREATED,
      message: 'Track created successfully',
      status: 'OK',
      data: track,
    })
  );
});

const getTracks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'categoryId', 'isFeatured', 'isSleepTonight']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const userId = req.user ? req.user.id : null;
  const result = await trackService.queryTracks(filter, options, userId);
  res.status(httpStatus.OK).send(
    response({
      code: httpStatus.OK,
      message: 'Tracks fetched successfully',
      status: 'OK',
      data: result,
    })
  );
});

const getTrack = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const track = await trackService.getTrackById(req.params.trackId, userId);
  res.status(httpStatus.OK).send(
    response({
      code: httpStatus.OK,
      message: 'Track fetched successfully',
      status: 'OK',
      data: track,
    })
  );
});

const updateTrack = catchAsync(async (req, res) => {
  const updateBody = { ...req.body };

  if (req.files) {
    if (req.files.audio) {
      updateBody.audioUrl = getFilePath(req.files.audio[0]);
      // Automatic Duration Calculation for new audio
      const duration = await getAudioDuration(updateBody.audioUrl);
      if (duration) updateBody.durationSeconds = duration;
    }
    if (req.files.coverImage) {
      updateBody.coverImageUrl = getFilePath(req.files.coverImage[0]);
    }
  }

  const track = await trackService.updateTrackById(req.params.trackId, updateBody);
  res.send({
    code: httpStatus.OK,
    message: 'Track updated successfully',
    data: track,
  });
});

const deleteTrack = catchAsync(async (req, res) => {
  await trackService.deleteTrackById(req.params.trackId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPopularTracks = catchAsync(async (req, res) => {
  const result = await trackService.getPopularTracks();
  res.status(httpStatus.OK).send(
    response({
      code: httpStatus.OK,
      message: 'Popular tracks fetched successfully',
      status: 'OK',
      data: result,
    })
  );
});

module.exports = {
  createTrack,
  getTracks,
  getTrack,
  getPopularTracks,
  updateTrack,
  deleteTrack,
};
