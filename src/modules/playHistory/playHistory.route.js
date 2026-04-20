const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const playHistoryValidation = require('./playHistory.validation');
const playHistoryController = require('./playHistory.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(playHistoryValidation.updatePlayHistory), playHistoryController.updatePlayHistory);

router
  .route('/continue-listening')
  .get(auth(), playHistoryController.getContinueListening);

module.exports = router;
