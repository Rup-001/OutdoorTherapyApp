const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const aboutUsValidation = require('./aboutUs.validation');
const aboutUsController = require('./aboutUs.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(aboutUsValidation.createAboutUs), aboutUsController.createAboutUs)
  .get(validate(aboutUsValidation.getAboutUs), aboutUsController.getAboutUs);

router
  .route('/:id')
  .patch(auth('manageUsers'), validate(aboutUsValidation.updateAboutUs), aboutUsController.updateAboutUs)
  .delete(auth('manageUsers'), validate(aboutUsValidation.deleteAboutUs), aboutUsController.deleteAboutUs);

module.exports = router;
