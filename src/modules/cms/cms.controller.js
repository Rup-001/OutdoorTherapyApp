const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const cmsService = require('./cms.service');

/**
 * --- About Us Controllers ---
 */
const createAboutUs = catchAsync(async (req, res) => {
  const result = await cmsService.createAboutUs(req.body);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: 'Created', data: result });
});

const getAboutUs = catchAsync(async (req, res) => {
  const result = await cmsService.getAboutUs();
  res.send({ code: httpStatus.OK, message: 'Fetched', data: result });
});

const updateAboutUs = catchAsync(async (req, res) => {
  const result = await cmsService.updateAboutUsById(req.params.id, req.body);
  res.send({ code: httpStatus.OK, message: 'Updated', data: result });
});

const deleteAboutUs = catchAsync(async (req, res) => {
  await cmsService.deleteAboutUsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * --- Privacy Policy Controllers ---
 */
const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await cmsService.createPrivacyPolicy(req.body);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: 'Created', data: result });
});

const getPrivacyPolicies = catchAsync(async (req, res) => {
  const result = await cmsService.getPrivacyPolicies();
  res.send({ code: httpStatus.OK, message: 'Fetched', data: result });
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await cmsService.updatePrivacyPolicyById(req.params.id, req.body);
  res.send({ code: httpStatus.OK, message: 'Updated', data: result });
});

const deletePrivacyPolicy = catchAsync(async (req, res) => {
  await cmsService.deletePrivacyPolicyById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * --- Terms & Conditions Controllers ---
 */
const createTermsConditions = catchAsync(async (req, res) => {
  const result = await cmsService.createTermsConditions(req.body);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: 'Created', data: result });
});

const getTermsConditions = catchAsync(async (req, res) => {
  const result = await cmsService.getTermsConditions();
  res.send({ code: httpStatus.OK, message: 'Fetched', data: result });
});

const updateTermsConditions = catchAsync(async (req, res) => {
  const result = await cmsService.updateTermsConditionsById(req.params.id, req.body);
  res.send({ code: httpStatus.OK, message: 'Updated', data: result });
});

const deleteTermsConditions = catchAsync(async (req, res) => {
  await cmsService.deleteTermsConditionsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  createTermsConditions,
  getTermsConditions,
  updateTermsConditions,
  deleteTermsConditions,
};
