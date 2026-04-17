const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Check config/config.js'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const text = `Dear user,
To reset your password, please use this token: ${token}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email (OTP)
 * @param {string} to
 * @param {string} otp
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, otp) => {
  const subject = 'Email Verification Code';
  const text = `Dear user,
Your verification code is: ${otp}
Please enter this code to verify your email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
