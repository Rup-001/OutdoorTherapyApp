const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const paginate = require('../../utils/paginate');
const bcrypt = require('bcryptjs');

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Create a user
 * @param {Object} userBody
 * @param {Object} [tx] - Prisma transaction client
 * @returns {Promise<User>}
 */
const createUser = async (userBody, tx) => {
  const client = tx || prisma;
  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  
  return client.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });
};

/**
 * Query for users
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (page, limit, sortBy)
 * @returns {Promise<Object>}
 */
const queryUsers = async (filter, options) => {
  const args = {
    where: {
      ...filter,
      fullName: filter.fullName ? { contains: filter.fullName, mode: 'insensitive' } : undefined,
    },
  };
  return paginate(prisma.user, args, options);
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  return prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
