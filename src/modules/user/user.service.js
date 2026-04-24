const httpStatus = require('http-status');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const paginate = require('../../utils/paginate');
const bcrypt = require('bcryptjs');
const { getSignedFileUrl } = require('../../services/r2.service');

/**
 * Map user profile image to full URL
 */
const mapUserImageUrl = async (user) => {
  if (!user) return user;
  return {
    ...user,
    profileImage: await getSignedFileUrl(user.profileImage),
  };
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await prisma.user.findUnique({ where: { email: userBody.email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const user = await prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
      isEmailVerified: userBody.isEmailVerified !== undefined ? userBody.isEmailVerified : false,
    },
  });
  return mapUserImageUrl(user);
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await paginate(prisma.user, filter, options);
  users.results = await Promise.all(users.results.map(mapUserImageUrl));
  return users;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return mapUserImageUrl(user);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return mapUserImageUrl(user);
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await prisma.user.findUnique({ where: { email: updateBody.email, NOT: { id: userId } } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
  return mapUserImageUrl(updatedUser);
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
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
