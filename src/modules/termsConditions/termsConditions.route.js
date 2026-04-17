const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const termsConditionsValidation = require('./termsConditions.validation');
const termsConditionsController = require('./termsConditions.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(termsConditionsValidation.createTermsConditions), termsConditionsController.createTermsConditions)
  .get(validate(termsConditionsValidation.getTermsConditions), termsConditionsController.getTermsConditions);

router
  .route('/:id')
  .patch(auth('manageUsers'), validate(termsConditionsValidation.updateTermsConditions), termsConditionsController.updateTermsConditions)
  .delete(auth('manageUsers'), validate(termsConditionsValidation.deleteTermsConditions), termsConditionsController.deleteTermsConditions);

module.exports = router;
