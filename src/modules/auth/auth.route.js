const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               fullName:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               password: password123
 *               fullName: John Doe
 *     responses:
 *       "201":
 *         description: Created
 */
router.post('/register', validate(authValidation.register), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: admin@example.com
 *               password: admin123
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Google Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *             example:
 *               idToken: "google-id-token"
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/google-login', validate(authValidation.googleLogin), authController.googleLogin);

/**
 * @swagger
 * /auth/apple-login:
 *   post:
 *     summary: Apple Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identityToken
 *             properties:
 *               identityToken:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *             example:
 *               identityToken: "apple-identity-token"
 *               user: { "name": { "firstName": "John", "lastName": "Doe" } }
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/apple-login', validate(authValidation.appleLogin), authController.appleLogin);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               code: "123456"
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/change-password', auth('common'), validate(authValidation.changePassword), authController.changePassword);
router.post('/delete-me', auth('user'), validate(authValidation.deleteMe), authController.deleteMe);

module.exports = router;
