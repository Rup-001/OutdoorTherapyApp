const { z } = require('zod');

const createUser = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().optional(),
    // role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']).default('USER'),
    role: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), 
    z.enum(['USER', 'ADMIN', 'SUPERADMIN']).default('USER')),  
  }),
};

const getUsers = {
  query: z.object({
    fullName: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']).optional(),
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
  }),
};

const getUser = {
  params: z.object({
    userId: z.string().uuid(),
  }),
};

const updateUser = {
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }).partial(), // Makes all fields optional
};

const deleteUser = {
  params: z.object({
    userId: z.string().uuid(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
