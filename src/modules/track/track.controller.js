const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { trackService } = require('./index');

const createTrack = catchAsync(async (req, res) => {
  const trackBody = {
    ...req.body,
  };

  // Handle multiple file uploads (audio and cover image)
  if (req.files) {
    if (req.files.audio) {
      const audioFile = req.files.audio[0];
      trackBody.audioUrl = audioFile.key || audioFile.path || audioFile.location;
    }
    if (req.files.coverImage) {
      const coverFile = req.files.coverImage[0];
      trackBody.coverImageUrl = coverFile.key || coverFile.path || coverFile.location;
    }
  }

  const track = await trackService.createTrack(trackBody);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Track created successfully',
    data: track,
  });
});

const getTracks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'categoryId', 'isFeatured', 'isSleepTonight']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await trackService.queryTracks(filter, options);
  res.send({
    code: httpStatus.OK,
    message: 'Tracks fetched successfully',
    data: result,
  });
});

const getTrack = catchAsync(async (req, res) => {
  const track = await trackService.getTrackById(req.params.trackId);
  res.send({
    code: httpStatus.OK,
    message: 'Track fetched successfully',
    data: track,
  });
});

const updateTrack = catchAsync(async (req, res) => {
  const updateBody = { ...req.body };

  // Handle file updates
  if (req.files) {
    if (req.files.audio) {
      const audioFile = req.files.audio[0];
      updateBody.audioUrl = audioFile.key || audioFile.path || audioFile.location;
    }
    if (req.files.coverImage) {
      const coverFile = req.files.coverImage[0];
      updateBody.coverImageUrl = coverFile.key || coverFile.path || coverFile.location;
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

module.exports = {
  createTrack,
  getTracks,
  getTrack,
  updateTrack,
  deleteTrack,
};
