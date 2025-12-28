import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


/**
 * Call AiPhotocraft Virtual Try-On API
 * @param {string} userPhotoPath - Path to user's photo file
 * @param {string} outfitPhotoPath - Path to outfit photo file
 * @returns {Promise<Object>} API response with result image URL
 */
export const callVirtualTryOnAPI = async (userPhotoPath, outfitPhotoPath) => {
  try {
    console.log('🔄 Calling AiPhotocraft API...');
    console.log('📸 User Photo Path:', userPhotoPath);
    console.log('👔 Outfit Photo Path:', outfitPhotoPath);

    // Create form data
    const formData = new FormData();

    // Append images as file streams
    formData.append('person_image', fs.createReadStream(userPhotoPath));
    formData.append('garment_image', fs.createReadStream(outfitPhotoPath));

    // Optional parameters - adjust based on AiPhotocraft's documentation
    formData.append('category', 'upper_body'); // Options: upper_body, lower_body, full_body
    formData.append('nsfw_filter', 'true');
    formData.append('quality', 'high'); // Options: low, medium, high

    // ========================================================
    // ⚠️ THIS IS WHERE THE API KEY IS USED ⚠️
    // ========================================================
    const response = await axios.post(
      process.env.AIPHOTOCRAFT_API_URL, // ← API endpoint from .env
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          // 🔑 API KEY IS USED IN AUTHORIZATION HEADER 🔑
          'Authorization': `Bearer ${process.env.AIPHOTOCRAFT_API_KEY}`,
          
          // Alternative header formats (check your API documentation):
          // 'X-API-Key': process.env.AIPHOTOCRAFT_API_KEY,
          // 'api-key': process.env.AIPHOTOCRAFT_API_KEY,
          // 'X-Auth-Token': process.env.AIPHOTOCRAFT_API_KEY,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000, // 2 minutes timeout for image processing
      }
    );

    console.log('✅ AiPhotocraft API Response Received');
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

    // Parse response based on AiPhotocraft's response format
    // Adjust these fields based on actual API documentation
    const resultImageUrl =
      response.data.result_url ||
      response.data.output_url ||
      response.data.image_url ||
      response.data.result?.url ||
      response.data.data?.url;

    const requestId =
      response.data.request_id ||
      response.data.id ||
      response.data.job_id ||
      response.data.task_id;

    if (!resultImageUrl) {
      console.error('❌ No result URL found in API response');
      return {
        success: false,
        error: 'API did not return a result image URL',
        statusCode: 500,
      };
    }

    return {
      success: true,
      data: response.data,
      resultImageUrl,
      requestId,
      processingTime: response.data.processing_time || 0,
    };
  } catch (error) {
    console.error('❌ AiPhotocraft API Error:', error.response?.data || error.message);

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      // 401 - Unauthorized (Invalid API Key)
      if (status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check AIPHOTOCRAFT_API_KEY in your .env file',
          statusCode: 401,
          details: data,
        };
      }

      // 403 - Forbidden (No permission)
      if (status === 403) {
        return {
          success: false,
          error: 'API key does not have permission for this operation',
          statusCode: 403,
          details: data,
        };
      }

      // 429 - Rate Limit Exceeded
      if (status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          statusCode: 429,
          details: data,
        };
      }

      // 400 - Bad Request
      if (status === 400) {
        return {
          success: false,
          error: data.message || 'Invalid request parameters',
          statusCode: 400,
          details: data,
        };
      }

      // Other API errors
      return {
        success: false,
        error: data.message || data.error || 'API request failed',
        statusCode: status,
        details: data,
      };
    }

    // Network errors
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'Cannot connect to AiPhotocraft API. Please check the API URL in .env',
        statusCode: 503,
      };
    }

    if (error.code === 'ETIMEDOUT') {
      return {
        success: false,
        error: 'API request timed out. The server took too long to respond.',
        statusCode: 504,
      };
    }

    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: 'API endpoint not found. Please verify AIPHOTOCRAFT_API_URL in .env',
        statusCode: 404,
      };
    }

    // Generic error
    return {
      success: false,
      error: error.message || 'Failed to process virtual try-on',
      statusCode: 500,
    };
  }
};

/**
 * Check processing status (if API supports async processing)
 * @param {string} requestId - Request ID from initial API call
 * @returns {Promise<Object>} Status response
 */
export const checkTryOnStatus = async (requestId) => {
  try {
    console.log('🔄 Checking try-on status for request:', requestId);

    const response = await axios.get(
      `${process.env.AIPHOTOCRAFT_API_URL}/status/${requestId}`,
      {
        headers: {
          // 🔑 API KEY USED HERE TOO 🔑
          'Authorization': `Bearer ${process.env.AIPHOTOCRAFT_API_KEY}`,
        },
        timeout: 30000, // 30 seconds
      }
    );

    return {
      success: true,
      status: response.data.status,
      resultUrl: response.data.result_url,
      progress: response.data.progress || 0,
      message: response.data.message || '',
    };
  } catch (error) {
    console.error('❌ Status check error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Download result image from URL (if needed)
 * @param {string} imageUrl - URL of the result image
 * @param {string} savePath - Local path to save the image
 * @returns {Promise<string>} Path to saved image
 */
export const downloadResultImage = async (imageUrl, savePath) => {
  try {
    console.log('📥 Downloading result image from:', imageUrl);

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000, // 1 minute
    });

    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('✅ Image downloaded successfully to:', savePath);
        resolve(savePath);
      });
      writer.on('error', (error) => {
        console.error('❌ Download error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('❌ Failed to download image:', error.message);
    throw error;
  }
};

export default {
  callVirtualTryOnAPI,
  checkTryOnStatus,
  downloadResultImage,
};