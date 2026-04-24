const prisma = require('../../config/prisma');
const moment = require('moment');

/**
 * Get Dashboard Stats
 * @returns {Promise<Object>}
 */
const getStats = async () => {
  const [totalUsers, totalTracks, activeSubscriptions, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: 'USER', isDeleted: false } }),
    prisma.track.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.user.findMany({
      take: 10,
      where: { role: 'USER', isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        userType: true,
        isBanned: true,
        createdAt: true,
      },
    }),
  ]);

  // User Growth (Last 30 Days)
  const userGrowth = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "createdAt") as date, 
      COUNT(id)::int as count 
    FROM users 
    WHERE "createdAt" > NOW() - INTERVAL '30 days'
    GROUP BY date 
    ORDER BY date ASC
  `;

  // Revenue Graph (Last 6 Months - Simplified count based on subscriptions)
  const revenueGraph = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month, 
      COUNT(id)::int as count 
    FROM subscriptions 
    WHERE status = 'ACTIVE' AND "createdAt" > NOW() - INTERVAL '6 months'
    GROUP BY month 
    ORDER BY month ASC
  `;

  return {
    stats: {
      totalUsers,
      totalTracks,
      activeSubscriptions,
      totalEarnings: 0, // Placeholder for Stripe integration
    },
    userGrowth,
    revenueGraph,
    recentUsers,
  };
};

module.exports = {
  getStats,
};
