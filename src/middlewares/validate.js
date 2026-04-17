const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  
  try {
    // Validate each part (body, query, params)
    Object.keys(validSchema).forEach((key) => {
      const result = validSchema[key].safeParse(object[key]);
      if (!result.success) {
        const errorMessage = result.error.issues
          .map((issue) => issue.message)
          .join(', ');
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
      }
      // Update request with parsed/transformed data
      req[key] = result.data;
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validate;
