const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const paginate = require('../../utils/paginate');

const createTermsConditions = async (body) => {
  return prisma.termsConditions.create({
    data: body,
  });
};

const queryTermsConditions = async (filter, options) => {
  return paginate(prisma.termsConditions, { where: filter }, options);
};

const getTermsConditionsById = async (id) => {
  return prisma.termsConditions.findUnique({
    where: { id },
  });
};

const updateTermsConditionsById = async (id, updateBody) => {
  const record = await getTermsConditionsById(id);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Terms and Conditions not found');
  }
  return prisma.termsConditions.update({
    where: { id },
    data: updateBody,
  });
};

const deleteTermsConditionsById = async (id) => {
  const record = await getTermsConditionsById(id);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Terms and Conditions not found');
  }
  return prisma.termsConditions.delete({
    where: { id },
  });
};

module.exports = {
  createTermsConditions,
  queryTermsConditions,
  getTermsConditionsById,
  updateTermsConditionsById,
  deleteTermsConditionsById,
};
