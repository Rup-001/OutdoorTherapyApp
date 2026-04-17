const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

const prisma = new PrismaClient();

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 8);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          fullName: 'System Super Admin',
          role: 'SUPERADMIN',
          isEmailVerified: true,
          isProfileCompleted: true,
        },
      });
      logger.info('Default Super Admin user seeded successfully!');
    } else {
      // Update existing admin to SUPERADMIN if needed
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'SUPERADMIN', fullName: 'System Super Admin' },
      });
      logger.info('Existing Admin updated to SUPERADMIN.');
    }
  } catch (error) {
    logger.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
