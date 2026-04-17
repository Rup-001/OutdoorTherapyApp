const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('./user.validation');
const userController = require('./user.controller');
const auth = require('../../middlewares/auth');
const fileUploadMiddleware = require('../../middlewares/fileUpload');
const convertHeicToPngMiddleware = require('../../middlewares/converter');

const UPLOADS_FOLDER_USERS = './public/uploads/users';
const upload = fileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

// Self Profile Routes
router.get('/self/in', auth('common'), userController.getProfile);
router.patch(
  '/self/update',
  auth('common'),
  upload.single('image'),
  convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
  validate(userValidation.updateUser),
  userController.updateProfile
);

// Admin Management Routes
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
