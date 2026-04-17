/**
 * Prisma pagination utility
 * @param {Object} model - Prisma model (e.g., prisma.user)
 * @param {Object} args - Prisma query arguments (where, include, etc.)
 * @param {Object} options - Pagination options (page, limit, sortBy)
 * @returns {Promise<Object>} - Paginated result
 */
const paginate = async (model, args = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const [totalResults, results] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...args,
      take: limit,
      skip,
      orderBy: options.sortBy
        ? { [options.sortBy.split(':')[0]]: options.sortBy.split(':')[1] || 'asc' }
        : { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

module.exports = paginate;
