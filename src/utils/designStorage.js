// Utility functions for managing design storage in localStorage

const STORAGE_KEY = 'saved_designs';
const EXPIRY_DAYS = 30;

/**
 * Get all saved designs from localStorage
 * @returns {Array} Array of saved designs
 */
export const getSavedDesigns = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const designs = JSON.parse(stored);
    // Filter out expired designs
    const now = Date.now();
    const validDesigns = designs.filter(design => {
      if (!design.expiresAt) return true;
      return design.expiresAt > now;
    });
    
    // If some designs were expired, update localStorage
    if (validDesigns.length !== designs.length) {
      saveDesignsToStorage(validDesigns);
    }
    
    return validDesigns;
  } catch (error) {
    console.error('Error reading saved designs:', error);
    return [];
  }
};

/**
 * Save designs array to localStorage
 * @param {Array} designs - Array of designs to save
 */
const saveDesignsToStorage = (designs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some old designs.');
    }
    throw error;
  }
};

/**
 * Save a new design to localStorage
 * @param {Object} designData - Design data to save
 * @returns {string} Design ID
 */
export const saveDesign = (designData) => {
  try {
    const designs = getSavedDesigns();
    const now = Date.now();
    const expiresAt = now + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    const newDesign = {
      id: `design_${now}_${Math.random().toString(36).substr(2, 9)}`,
      name: designData.name || `Design ${new Date().toLocaleDateString()}`,
      designImage: designData.designImage, // base64 string
      thumbnail: designData.thumbnail, // base64 string (smaller preview)
      mockupImage: designData.mockupImage, // URL or base64
      productName: designData.productName || 'Custom Product',
      productPrice: designData.productPrice || 100000,
      productCurrency: designData.productCurrency || 'VNĐ',
      printAreaConfig: designData.printAreaConfig || {
        top: 20,
        left: 15,
        width: 70,
        height: 60
      },
      selectedColor: designData.selectedColor || '',
      selectedSize: designData.selectedSize || '',
      createdAt: now,
      expiresAt: expiresAt,
      updatedAt: now
    };
    
    designs.push(newDesign);
    saveDesignsToStorage(designs);
    
    return newDesign.id;
  } catch (error) {
    if (error.message.includes('quota')) {
      throw error;
    }
    console.error('Error saving design:', error);
    throw new Error('Failed to save design. Please try again.');
  }
};

/**
 * Delete a design from localStorage
 * @param {string} designId - ID of design to delete
 */
export const deleteDesign = (designId) => {
  try {
    const designs = getSavedDesigns();
    const filtered = designs.filter(d => d.id !== designId);
    saveDesignsToStorage(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting design:', error);
    return false;
  }
};

/**
 * Update design name
 * @param {string} designId - ID of design to update
 * @param {string} newName - New name for the design
 */
export const updateDesignName = (designId, newName) => {
  try {
    const designs = getSavedDesigns();
    const design = designs.find(d => d.id === designId);
    if (!design) return false;
    
    design.name = newName;
    design.updatedAt = Date.now();
    saveDesignsToStorage(designs);
    return true;
  } catch (error) {
    console.error('Error updating design name:', error);
    return false;
  }
};

/**
 * Get a specific design by ID
 * @param {string} designId - ID of design to retrieve
 * @returns {Object|null} Design object or null if not found
 */
export const getDesignById = (designId) => {
  const designs = getSavedDesigns();
  return designs.find(d => d.id === designId) || null;
};

/**
 * Clean up expired designs
 */
export const cleanupExpiredDesigns = () => {
  try {
    const designs = getSavedDesigns();
    const now = Date.now();
    const validDesigns = designs.filter(design => {
      if (!design.expiresAt) return true;
      return design.expiresAt > now;
    });
    
    if (validDesigns.length !== designs.length) {
      saveDesignsToStorage(validDesigns);
      return designs.length - validDesigns.length;
    }
    return 0;
  } catch (error) {
    console.error('Error cleaning up expired designs:', error);
    return 0;
  }
};

/**
 * Get storage usage estimate
 * @returns {Object} Storage usage info
 */
export const getStorageInfo = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        used: 0,
        count: 0,
        limit: 5 * 1024 * 1024, // 5MB typical limit
        percentage: 0
      };
    }
    
    const size = new Blob([stored]).size;
    const designs = JSON.parse(stored);
    
    return {
      used: size,
      count: designs.length,
      limit: 5 * 1024 * 1024,
      percentage: (size / (5 * 1024 * 1024)) * 100
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      used: 0,
      count: 0,
      limit: 5 * 1024 * 1024,
      percentage: 0
    };
  }
};

