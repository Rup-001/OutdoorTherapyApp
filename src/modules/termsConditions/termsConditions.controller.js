const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const termsConditionsService = require('./termsConditions.service');
const pick = require('../../utils/pick');

const createTermsConditions = catchAsync(async (req, res) => {
  const record = await termsConditionsService.createTermsConditions(req.body);
  res.status(httpStatus.CREATED).send(record);
});

const getTermsConditions = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await termsConditionsService.queryTermsConditions(filter, options);
  res.send(result);
});

const updateTermsConditions = catchAsync(async (req, res) => {
  const record = await termsConditionsService.updateTermsConditionsById(req.params.id, req.body);
  res.send(record);
});

const deleteTermsConditions = catchAsync(async (req, res) => {
  await termsConditionsService.deleteTermsConditionsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTermsConditions,
  getTermsConditions,
  updateTermsConditions,
  deleteTermsConditions,
};
