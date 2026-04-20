const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const playHistoryService = require('./playHistory.service');
const response = require('../../config/response');

const updatePlayHistory = catchAsync(async (req, res) => {
  const { trackId, playedSeconds } = req.body;
  const result = await playHistoryService.updatePlayHistory(req.user.id, trackId, playedSeconds);
  res.status(httpStatus.OK).json(
    response({
      message: 'Play history updated',
      status: 'OK',
      code: httpStatus.OK,
      data: result,
    })
  );
});

const getContinueListening = catchAsync(async (req, res) => {
  const result = await playHistoryService.getContinueListening(req.user.id);
  res.status(httpStatus.OK).json(
    response({
      message: 'Continue Listening tracks fetched',
      status: 'OK',
      code: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  updatePlayHistory,
  getContinueListening,
};
