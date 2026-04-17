const allRoles = {
  USER: ['common', 'user'],
  ADMIN: ['common', 'commonAdmin', 'admin', 'getUsers', 'manageUsers'],
  SUPERADMIN: ['common', 'commonAdmin', 'superAdmin', 'getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
