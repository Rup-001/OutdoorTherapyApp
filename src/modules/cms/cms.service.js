const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../../utils/ApiError');

const prisma = new PrismaClient();

/**
 * --- About Us Logic ---
 */
const createAboutUs = async (body) => {
  return prisma.aboutUs.create({ data: body });
};

const getAboutUs = async () => {
  return prisma.aboutUs.findFirst({ orderBy: { createdAt: 'desc' } });
};

const updateAboutUsById = async (id, updateBody) => {
  return prisma.aboutUs.update({ where: { id }, data: updateBody });
};

const deleteAboutUsById = async (id) => {
  return prisma.aboutUs.delete({ where: { id } });
};

/**
 * --- Privacy Policy Logic ---
 */
const createPrivacyPolicy = async (body) => {
  return prisma.privacyPolicy.create({ data: body });
};

const getPrivacyPolicies = async () => {
  return prisma.privacyPolicy.findFirst({ orderBy: { createdAt: 'desc' } });
};

const updatePrivacyPolicyById = async (id, updateBody) => {
  return prisma.privacyPolicy.update({ where: { id }, data: updateBody });
};

const deletePrivacyPolicyById = async (id) => {
  return prisma.privacyPolicy.delete({ where: { id } });
};

/**
 * --- Terms & Conditions Logic ---
 */
const createTermsConditions = async (body) => {
  return prisma.termsConditions.create({ data: body });
};

const getTermsConditions = async () => {
  return prisma.termsConditions.findFirst({ orderBy: { createdAt: 'desc' } });
};

const updateTermsConditionsById = async (id, updateBody) => {
  return prisma.termsConditions.update({ where: { id }, data: updateBody });
};

const deleteTermsConditionsById = async (id) => {
  return prisma.termsConditions.delete({ where: { id } });
};

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUsById,
  deleteAboutUsById,
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicyById,
  deletePrivacyPolicyById,
  createTermsConditions,
  getTermsConditions,
  updateTermsConditionsById,
  deleteTermsConditionsById,
};
