const express = require('express');
const validate = require('../../middlewares/validate');
const appSettingsValidation = require('./appSettings.validation');
const appSettingsController = require('./appSettings.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AppSettings
 *   description: App general settings
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get app settings
 *     tags: [AppSettings]
 *     responses:
 *       "200":
 *         description: OK
 */
router.get('/', appSettingsController.getSettings);

/**
 * @swagger
 * /settings:
 *   patch:
 *     summary: Update app settings (Admin Only)
 *     tags: [AppSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppSettings'
 *     responses:
 *       "200":
 *         description: OK
 */
router.patch('/', auth('admin'), validate(appSettingsValidation.updateSettings), appSettingsController.updateSettings);

module.exports = router;
