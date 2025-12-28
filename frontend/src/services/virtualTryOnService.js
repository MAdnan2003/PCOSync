import api from './api';

/**
 * Generate virtual try-on
 */
export const generateVirtualTryOn = async (userPhoto, outfitPhoto, notes = '', tags = []) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  formData.append('outfitPhoto', outfitPhoto);
  
  if (notes) formData.append('notes', notes);
  if (tags.length > 0) formData.append('tags', tags.join(','));

  const response = await api.post('/virtual-tryon', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Get all try-ons
 */
export const getTryOns = async (params = {}) => {
  const { page = 1, limit = 12, isFavorite = null, search = '', sortBy = 'createdAt' } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });

  if (isFavorite !== null) queryParams.append('isFavorite', isFavorite.toString());
  if (search) queryParams.append('search', search);

  const response = await api.get(`/virtual-tryon?${queryParams}`);
  return response.data;
};

/**
 * Get single try-on
 */
export const getTryOnById = async (id) => {
  const response = await api.get(`/virtual-tryon/${id}`);
  return response.data;
};

/**
 * Toggle favorite
 */
export const toggleFavorite = async (id) => {
  const response = await api.patch(`/virtual-tryon/${id}/favorite`);
  return response.data;
};

/**
 * Update try-on
 */
export const updateTryOn = async (id, data) => {
  const response = await api.put(`/virtual-tryon/${id}`, data);
  return response.data;
};

/**
 * Delete try-on
 */
export const deleteTryOn = async (id) => {
  const response = await api.delete(`/virtual-tryon/${id}`);
  return response.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  const response = await api.get('/virtual-tryon/stats');
  return response.data;
};

export default {
  generateVirtualTryOn,
  getTryOns,
  getTryOnById,
  toggleFavorite,
  updateTryOn,
  deleteTryOn,
  getUserStats,
};