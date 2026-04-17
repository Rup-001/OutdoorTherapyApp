const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const paginate = require('../../utils/paginate');

const createPrivacyPolicy = async (body) => {
  return prisma.privacyPolicy.create({
    data: body,
  });
};

const queryPrivacyPolicies = async (filter, options) => {
  return paginate(prisma.privacyPolicy, { where: filter }, options);
};

const getPrivacyPolicyById = async (id) => {
  return prisma.privacyPolicy.findUnique({
    where: { id },
  });
};

const updatePrivacyPolicyById = async (id, updateBody) => {
  const record = await getPrivacyPolicyById(id);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
  }
  return prisma.privacyPolicy.update({
    where: { id },
    data: updateBody,
  });
};

const deletePrivacyPolicyById = async (id) => {
  const record = await getPrivacyPolicyById(id);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
  }
  return prisma.privacyPolicy.delete({
    where: { id },
  });
};

module.exports = {
  createPrivacyPolicy,
  queryPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicyById,
  deletePrivacyPolicyById,
};
