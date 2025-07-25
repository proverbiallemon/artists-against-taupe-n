// Authentication utilities

// Get auth token from localStorage
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};