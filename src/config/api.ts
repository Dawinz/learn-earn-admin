// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learn-earn-backend-1.onrender.com';

export const API_ENDPOINTS = {
  // Admin endpoints
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  SETTINGS: `${API_BASE_URL}/api/admin/settings`,
  PAYOUTS: `${API_BASE_URL}/api/admin/payouts`,
  LESSONS: `${API_BASE_URL}/api/admin/lessons`,
  USERS: `${API_BASE_URL}/api/admin/users`,
  ANALYTICS: `${API_BASE_URL}/api/admin/analytics`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
