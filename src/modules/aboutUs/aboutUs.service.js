const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const paginate = require('../../utils/paginate');

/**
 * Create an about us record
 * @param {Object} aboutUsBody
 * @returns {Promise<AboutUs>}
 */
const createAboutUs = async (aboutUsBody) => {
  return prisma.aboutUs.create({
    data: aboutUsBody,
  });
};

/**
 * Query for about us records
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (page, limit, sortBy)
 * @returns {Promise<Object>}
 */
const queryAboutUs = async (filter, options) => {
  const args = {
    where: filter,
  };
  return paginate(prisma.aboutUs, args, options);
};

/**
 * Get about us by id
 * @param {string} id
 * @returns {Promise<AboutUs>}
 */
const getAboutUsById = async (id) => {
  return prisma.aboutUs.findUnique({
    where: { id },
  });
};

/**
 * Update about us by id
 * @param {string} id
 * @param {Object} updateBody
 * @returns {Promise<AboutUs>}
 */
const updateAboutUsById = async (id, updateBody) => {
  const aboutUs = await getAboutUsById(id);
  if (!aboutUs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About Us record not found');
  }
  return prisma.aboutUs.update({
    where: { id },
    data: updateBody,
  });
};

/**
 * Delete about us by id
 * @param {string} id
 * @returns {Promise<AboutUs>}
 */
const deleteAboutUsById = async (id) => {
  const aboutUs = await getAboutUsById(id);
  if (!aboutUs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About Us record not found');
  }
  return prisma.aboutUs.delete({
    where: { id },
  });
};

module.exports = {
  createAboutUs,
  queryAboutUs,
  getAboutUsById,
  updateAboutUsById,
  deleteAboutUsById,
};
