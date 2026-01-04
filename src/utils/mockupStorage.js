// Utility functions for managing custom mockups in localStorage

const STORAGE_KEY = 'custom_mockups';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

/**
 * Get all custom mockups from localStorage
 * @returns {Array} Array of custom mockups
 */
export const getCustomMockups = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading custom mockups:', error);
    return [];
  }
};

/**
 * Save mockups array to localStorage
 * @param {Array} mockups - Array of mockups to save
 */
const saveMockupsToStorage = (mockups) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockups));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some old mockups.');
    }
    throw error;
  }
};

/**
 * Validate uploaded file
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateMockupFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please select a file' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload PNG or JPG images only.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit. Please upload a smaller image.' };
  }

  return { valid: true };
};

/**
 * Generate thumbnail from image
 * @param {string} imageSrc - Base64 image source
 * @param {number} maxWidth - Max thumbnail width
 * @param {number} maxHeight - Max thumbnail height
 * @returns {Promise<string>} Base64 thumbnail
 */
export const generateThumbnail = (imageSrc, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png', 0.8));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

/**
 * Save a custom mockup
 * @param {File} file - Mockup file to save
 * @param {string} name - Optional name for the mockup
 * @returns {Promise<Object>} Saved mockup object
 */
export const saveCustomMockup = async (file, name = null) => {
  try {
    // Validate file
    const validation = validateMockupFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Read file as base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Generate thumbnail
    const thumbnail = await generateThumbnail(base64);

    // Create mockup object
    const now = Date.now();
    const mockup = {
      id: `mockup_${now}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || file.name.replace(/\.[^.]+$/, ''),
      originalName: file.name,
      image: base64,
      thumbnail: thumbnail,
      createdAt: now,
      fileSize: file.size,
      fileType: file.type
    };

    // Save to localStorage
    const mockups = getCustomMockups();
    mockups.push(mockup);
    saveMockupsToStorage(mockups);

    return mockup;
  } catch (error) {
    if (error.message.includes('quota')) {
      throw error;
    }
    console.error('Error saving custom mockup:', error);
    throw new Error(error.message || 'Failed to save mockup. Please try again.');
  }
};

/**
 * Delete a custom mockup
 * @param {string} mockupId - ID of mockup to delete
 */
export const deleteCustomMockup = (mockupId) => {
  try {
    const mockups = getCustomMockups();
    const filtered = mockups.filter(m => m.id !== mockupId);
    saveMockupsToStorage(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting mockup:', error);
    return false;
  }
};

/**
 * Get mockup by ID
 * @param {string} mockupId - ID of mockup to retrieve
 * @returns {Object|null} Mockup object or null
 */
export const getMockupById = (mockupId) => {
  const mockups = getCustomMockups();
  return mockups.find(m => m.id === mockupId) || null;
};

