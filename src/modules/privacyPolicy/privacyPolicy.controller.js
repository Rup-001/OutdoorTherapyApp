const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const privacyPolicyService = require('./privacyPolicy.service');
const pick = require('../../utils/pick');

const createPrivacyPolicy = catchAsync(async (req, res) => {
  const record = await privacyPolicyService.createPrivacyPolicy(req.body);
  res.status(httpStatus.CREATED).send(record);
});

const getPrivacyPolicies = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await privacyPolicyService.queryPrivacyPolicies(filter, options);
  res.send(result);
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const record = await privacyPolicyService.updatePrivacyPolicyById(req.params.id, req.body);
  res.send(record);
});

const deletePrivacyPolicy = catchAsync(async (req, res) => {
  await privacyPolicyService.deletePrivacyPolicyById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
