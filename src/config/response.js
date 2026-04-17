/**
 * Standard API response formatter
 * @param {Object} options
 * @param {string} options.message - Success message
 * @param {string} options.status - Status string (e.g., "OK")
 * @param {number} options.code - HTTP status code
 * @param {Object} [options.data] - Data object to return
 * @returns {Object}
 */
const response = ({ message, status, code, data = {} }) => {
  return {
    message,
    status,
    code,
    data,
  };
};

module.exports = response;
