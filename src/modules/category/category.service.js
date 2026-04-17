const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../../utils/ApiError');

const prisma = new PrismaClient();

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody,
  });
};

/**
 * Query for categories
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const { limit = 10, page = 1, sortBy } = options;
  const skip = (page - 1) * limit;

  let orderBy = { createdAt: 'desc' };
  if (sortBy) {
    const [field, order] = sortBy.split(':');
    orderBy = { [field]: order };
  }

  const categories = await prisma.category.findMany({
    where: filter,
    take: limit,
    skip: skip,
    orderBy: orderBy,
  });

  const totalResults = await prisma.category.count({ where: filter });
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: categories,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get category by id
 * @param {string} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { tracks: true }
      }
    }
  });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

/**
 * Update category by id
 * @param {string} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  
  const updatedCategory = await prisma.category.update({
    where: { id: category.id },
    data: updateBody,
  });

  return updatedCategory;
};

/**
 * Delete category by id
 * @param {string} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  
  await prisma.category.delete({
    where: { id: category.id },
  });

  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
