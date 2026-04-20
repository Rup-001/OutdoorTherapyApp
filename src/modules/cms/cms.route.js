const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cmsValidation = require('./cms.validation');
const cmsController = require('./cms.controller');

const adminRouter = express.Router();
const userRouter = express.Router();

/**
 * --- About Us Routes ---
 */
adminRouter.post('/about-us', auth('manageUsers'), validate(cmsValidation.createCms), cmsController.createAboutUs);
adminRouter.patch('/about-us/:id', auth('manageUsers'), validate(cmsValidation.updateCms), cmsController.updateAboutUs);
adminRouter.delete('/about-us/:id', auth('manageUsers'), validate(cmsValidation.getCmsById), cmsController.deleteAboutUs);

userRouter.get('/about-us', cmsController.getAboutUs);

/**
 * --- Privacy Policy Routes ---
 */
adminRouter.post('/privacy-policies', auth('manageUsers'), validate(cmsValidation.createCms), cmsController.createPrivacyPolicy);
adminRouter.patch('/privacy-policies/:id', auth('manageUsers'), validate(cmsValidation.updateCms), cmsController.updatePrivacyPolicy);
adminRouter.delete('/privacy-policies/:id', auth('manageUsers'), validate(cmsValidation.getCmsById), cmsController.deletePrivacyPolicy);

userRouter.get('/privacy-policies', cmsController.getPrivacyPolicies);

/**
 * --- Terms & Conditions Routes ---
 */
adminRouter.post('/terms-conditions', auth('manageUsers'), validate(cmsValidation.createCms), cmsController.createTermsConditions);
adminRouter.patch('/terms-conditions/:id', auth('manageUsers'), validate(cmsValidation.updateCms), cmsController.updateTermsConditions);
adminRouter.delete('/terms-conditions/:id', auth('manageUsers'), validate(cmsValidation.getCmsById), cmsController.deleteTermsConditions);

userRouter.get('/terms-conditions', cmsController.getTermsConditions);

module.exports = { adminRouter, userRouter };
