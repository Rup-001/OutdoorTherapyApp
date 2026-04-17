const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('./category.validation');
const categoryController = require('./category.controller');
const upload = require('../../middlewares/fileUpload');

const router = express.Router();

const categoryUpload = upload('uploads/categories', ['image/jpeg', 'image/png', 'image/webp']);

router
  .route('/')
  .post(
    auth('commonAdmin'), 
    categoryUpload.single('coverImage'), 
    validate(categoryValidation.createCategory), 
    categoryController.createCategory
  )
  .get(validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(
    auth('commonAdmin'), 
    categoryUpload.single('coverImage'), 
    validate(categoryValidation.updateCategory), 
    categoryController.updateCategory
  )
  .delete(auth('commonAdmin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
