const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const appSettingsService = require('./appSettings.service');
const response = require('../../config/response');
const ApiError = require('../../utils/ApiError');

const getSettings = catchAsync(async (req, res) => {
  const settings = await appSettingsService.getSettings();
  if (!settings) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  
  // Logic: Exclude sensitive fields for public view
  const { stripeSecretKey, ...publicSettings } = settings;
  
  res.status(httpStatus.OK).json(
    response({
      message: 'App Settings Fetched',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: publicSettings,
    })
  );
});

const updateSettings = catchAsync(async (req, res) => {
  const settings = await appSettingsService.updateSettings(req.body);
  
  res.status(httpStatus.OK).json(
    response({
      message: 'App Settings Updated',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: settings,
    })
  );
});

module.exports = {
  getSettings,
  updateSettings,
};
