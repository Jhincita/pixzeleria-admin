// API Configuration
// Uses environment variable in production, falls back to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// API endpoints
export const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}/api/auth`,
    USERS: `${API_BASE_URL}/api/users`,
    PIZZAS: `${API_BASE_URL}/api/pizzas`,
    INGREDIENTS: `${API_BASE_URL}/api/ingredients`,
    ORDERS: `${API_BASE_URL}/api/orders`,
};
