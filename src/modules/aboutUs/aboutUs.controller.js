const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const aboutUsService = require('./aboutUs.service');
const pick = require('../../utils/pick');

const createAboutUs = catchAsync(async (req, res) => {
  const aboutUs = await aboutUsService.createAboutUs(req.body);
  res.status(httpStatus.CREATED).send(aboutUs);
});

const getAboutUs = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await aboutUsService.queryAboutUs(filter, options);
  res.send(result);
});

const updateAboutUs = catchAsync(async (req, res) => {
  const aboutUs = await aboutUsService.updateAboutUsById(req.params.id, req.body);
  res.send(aboutUs);
});

const deleteAboutUs = catchAsync(async (req, res) => {
  await aboutUsService.deleteAboutUsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
