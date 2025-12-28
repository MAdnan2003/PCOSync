export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VIRTUAL_TRYON: '/virtual-tryon',
  MY_TRYONS: '/my-tryons',
  PROFILE: '/profile',
};

export const MESSAGES = {
  SUCCESS: {
    TRYON_GENERATED: 'Virtual try-on generated successfully!',
    TRYON_DELETED: 'Try-on deleted successfully!',
    TRYON_UPDATED: 'Try-on updated successfully!',
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
  },
  ERROR: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UPLOAD_ERROR: 'Failed to upload images. Please try again.',
    INVALID_FILE: 'Invalid file type or size.',
    AUTH_REQUIRED: 'Please login to continue.',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pcosync_auth_token',
  USER_DATA: 'pcosync_user_data',
};

export default {
  API_URL,
  BASE_URL,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  ROUTES,
  MESSAGES,
  STORAGE_KEYS,
};