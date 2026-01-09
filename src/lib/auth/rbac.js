/**
 * Role-Based Access Control utilities
 */

export const ROLES = {
  ADMIN: 'admin',
  FOUNDER: 'founder',
  CLIENT: 'client',
};

/**
 * Check if user has required role
 */
export function hasRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false;
  
  // Admin and founder have full access
  if (userRole === ROLES.ADMIN || userRole === ROLES.FOUNDER) {
    return true;
  }
  
  return userRole === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRole, requiredRoles) {
  if (!userRole || !Array.isArray(requiredRoles)) return false;
  
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * Check if user can access client data
 */
export function canAccessClientData(userRole, userId, clientId) {
  // Admin and founder can access all client data
  if (userRole === ROLES.ADMIN || userRole === ROLES.FOUNDER) {
    return true;
  }
  
  // Clients can only access their own data
  if (userRole === ROLES.CLIENT) {
    return userId === clientId;
  }
  
  return false;
}

