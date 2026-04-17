const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const trackValidation = require('./track.validation');
const trackController = require('./track.controller');
const upload = require('../../middlewares/fileUpload');

const router = express.Router();

const trackUpload = upload('uploads/tracks', [
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'
]);

router
  .route('/')
  .post(
    auth('commonAdmin'), 
    trackUpload.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 }
    ]), 
    validate(trackValidation.createTrack), 
    trackController.createTrack
  )
  .get(validate(trackValidation.getTracks), trackController.getTracks);

router
  .route('/:trackId')
  .get(validate(trackValidation.getTrack), trackController.getTrack)
  .patch(
    auth('commonAdmin'), 
    trackUpload.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 }
    ]), 
    validate(trackValidation.updateTrack), 
    trackController.updateTrack
  )
  .delete(auth('commonAdmin'), validate(trackValidation.deleteTrack), trackController.deleteTrack);

module.exports = router;
