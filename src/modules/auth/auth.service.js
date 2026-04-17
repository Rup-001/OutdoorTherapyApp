const httpStatus = require('http-status');
const userService = require('../user/user.service');
const tokenService = require('./token.service');
const ApiError = require('../../utils/ApiError');
const bcrypt = require('bcryptjs');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || user.isDeleted || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await prisma.token.findUnique({
    where: { token: refreshToken, type: 'REFRESH', blacklisted: false },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await prisma.token.delete({ where: { id: refreshTokenDoc.id } });
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'REFRESH');
    const user = await userService.getUserById(refreshTokenDoc.userId);
    if (!user) throw new Error();
    await prisma.token.delete({ where: { id: refreshTokenDoc.id } });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const verifyEmail = async (email, code) => {
  const user = await userService.getUserByEmail(email);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  } else if (user.oneTimeCode === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP expired');
  } else if (code !== user.oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  } else if (user.isEmailVerified && !user.isResetPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already verified');
  }

  // Update user status
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { 
      isEmailVerified: true, 
      oneTimeCode: null 
      // Note: isResetPassword will be handled in resetPassword logic if needed
    },
  });

  return updatedUser;
};

const resetPassword = async (newPassword, email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.oneTimeCode !== null || user.isResetPassword !== true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please verify your email first');
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have previously used this password. Please choose a different one.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword, 
      isResetPassword: false 
    },
  });

  return user;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password incorrect');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
};

const deleteMe = async (userId, password) => {
  const user = await userService.getUserById(userId);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password incorrect');
  }
  await prisma.user.update({ where: { id: userId }, data: { isDeleted: true } });
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  verifyEmail,
  resetPassword,
  changePassword,
  deleteMe,
};
