const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const privacyPolicyValidation = require('./privacyPolicy.validation');
const privacyPolicyController = require('./privacyPolicy.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(privacyPolicyValidation.createPrivacyPolicy), privacyPolicyController.createPrivacyPolicy)
  .get(validate(privacyPolicyValidation.getPrivacyPolicies), privacyPolicyController.getPrivacyPolicies);

router
  .route('/:id')
  .patch(auth('manageUsers'), validate(privacyPolicyValidation.updatePrivacyPolicy), privacyPolicyController.updatePrivacyPolicy)
  .delete(auth('manageUsers'), validate(privacyPolicyValidation.deletePrivacyPolicy), privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
