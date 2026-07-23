const configuredApiUrl = process.env.REACT_APP_API_URL || 'https://ecommerce-backend-0xny.onrender.com';

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '');
