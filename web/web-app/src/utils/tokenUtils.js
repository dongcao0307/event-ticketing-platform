/**
 * Utility functions for JWT token handling
 */

/**
 * Decode JWT token payload
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64 decode (URL-safe base64)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get user role from JWT token
 * @returns {string} - User role or 'USER' as default
 */
export const getRoleFromToken = () => {
  const token = localStorage.getItem('jwt_token');
  const decoded = decodeToken(token);
  return decoded?.role || 'USER';
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return getRoleFromToken() === 'ADMIN';
};

/**
 * Get user ID from JWT token
 * @returns {number|null} - User ID or null if not found
 */
export const getUserIdFromToken = () => {
  const token = localStorage.getItem('jwt_token');
  const decoded = decodeToken(token);
  return decoded?.sub ? Number(decoded.sub) : null;
};

