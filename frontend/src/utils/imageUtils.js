import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

/**
 * Validate image file
 */
export const validateImage = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${(MAX_FILE_SIZE / 1048576).toFixed(0)}MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Convert file to base64 preview
 */
export const fileToPreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Create object URL for preview
 */
export const createPreviewURL = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke object URL
 */
export const revokePreviewURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export default {
  validateImage,
  fileToPreview,
  formatFileSize,
  createPreviewURL,
  revokePreviewURL,
};