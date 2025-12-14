<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full flex items-start justify-center p-8">
      <!-- Layout chia 2 cột -->
      <div class="product-container">
        
        <!-- Mockup bên trái - Column 1 -->
        <div class="mockup-column">
          <div class="mockup-container">
            <img
            :src="getMockupImage()"
            :alt="product?.name || 'Product Mockup'"
            class="mockup-image"
            ref="mockupImage"
            @error="handleImageError"
            @load="onMockupLoad"
            />
            <!-- Print Area Overlay -->
            <div class="print-area-overlay" :style="printAreaStyle">
              <span style="
                color: #3b82f6;
                font-size: 0.875rem;
                font-weight: 500;
                background-color: rgba(255, 255, 255, 0.9);
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
              ">
                Print Area
              </span>
            </div>
            <canvas
              ref="canvas"
              class="mockup-canvas"
              style="z-index: 2;"
            ></canvas>
          </div>
        </div>

        <!-- Info bên phải - Column 2 -->
        <div class="info-column">
          <h1 class="product-title">{{ product?.name || 'Custom Product' }}</h1>
          <h2 class="product-price">{{ formatPrice(product?.price || 0) }} {{ product?.currency || 'VNĐ' }}</h2>
          <p class="product-description">
            {{ product?.description || 'Preview the print area on the product mockup.' }}
          </p>
          
          <!-- Print Area Settings (Optional - for testing/adjustment) -->
          <div class="form-section" style="background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
            <label class="form-label">Print Area Settings (for testing):</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
              <div>
                <label style="font-size: 0.75rem; color: #6b7280;">Top (%)</label>
                <input 
                  v-model.number="printAreaConfig.top" 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="1"
                style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background-color: #ffffff; color: #111827;"
                />
              </div>
              <div>
                <label style="font-size: 0.75rem; color: #6b7280;">Left (%)</label>
                <input 
                  v-model.number="printAreaConfig.left" 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="1"
                style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background-color: #ffffff; color: #111827;"
                />
              </div>
              <div>
                <label style="font-size: 0.75rem; color: #6b7280;">Width (%)</label>
                <input 
                  v-model.number="printAreaConfig.width" 
                  type="number" 
                  min="1" 
                  max="100" 
                  step="1"
                style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background-color: #ffffff; color: #111827;"
                />
              </div>
              <div>
                <label style="font-size: 0.75rem; color: #6b7280;">Height (%)</label>
                <input 
                  v-model.number="printAreaConfig.height" 
                  type="number" 
                  min="1" 
                  max="100" 
                  step="1"
                style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background-color: #ffffff; color: #111827;"
                />
              </div>
            </div>
            <button 
              @click="resetPrintArea"
              style="
                padding: 0.25rem 0.5rem;
                background-color: #6b7280;
                color: white;
                border: none;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                cursor: pointer;
              "
            >
              Reset to Default
            </button>
          </div>
          
          <!-- Size Selection -->
          <div v-if="product?.sizes" class="form-section" style="text-align: center;">
            <label class="form-label" style="text-align: center;">Choose Size:</label>
            <div class="color-buttons">
              <button
                v-for="size in product.sizes"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'color-button',
                  selectedSize === size ? 'selected' : ''
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>
          
          <!-- Color Selection -->
          <div v-if="product?.colors" class="form-section" style="text-align: center;">
            <label class="form-label" style="text-align: center;">Choose Color:</label>
            <div class="color-buttons">
              <button
                v-for="color in product.colors"
                :key="color"
                @click="selectedColor = color"
                :class="[
                  'color-button',
                  selectedColor === color ? 'selected' : ''
                ]"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <!-- File Upload -->
          <div class="form-section">
            <label class="form-label">Upload Design:</label>
            <div class="file-upload-container">
              <input 
                ref="fileInput"
                type="file" 
                @change="handleUpload"
                accept="image/*"
                class="file-upload-input"
                id="file-upload"
              />
              <label for="file-upload" class="file-upload-button">
                <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span class="file-upload-text">Choose File</span>
              </label>
              <div v-if="selectedFileName" class="file-name">
                Selected: {{ selectedFileName }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-section" style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button 
              @click="saveDesign"
              :disabled="!selectedFileName || isSaving"
              class="save-button"
              style="
                padding: 0.75rem 1.5rem;
                background-color: #3b82f6;
                color: white;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
                flex: 1;
                min-width: 150px;
              "
              :style="(!selectedFileName || isSaving) ? 'background-color: #9ca3af; cursor: not-allowed;' : ''"
              @mouseover="selectedFileName && !isSaving && (this.style.backgroundColor='#2563eb')"
              @mouseout="selectedFileName && !isSaving && (this.style.backgroundColor='#3b82f6')"
            >
              <svg v-if="!isSaving" style="width: 1rem; height: 1rem; margin-right: 0.5rem; display: inline-block; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Design</span>
            </button>
            <button 
              @click="downloadDesign"
              :disabled="!selectedFileName"
              class="download-button"
              style="
                padding: 0.75rem 1.5rem;
                background-color: #10b981;
                color: white;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
                flex: 1;
                min-width: 150px;
              "
              :style="!selectedFileName ? 'background-color: #9ca3af; cursor: not-allowed;' : ''"
              @mouseover="selectedFileName && (this.style.backgroundColor='#059669')"
              @mouseout="selectedFileName && (this.style.backgroundColor='#10b981')"
            >
              <svg style="width: 1rem; height: 1rem; margin-right: 0.5rem; display: inline-block; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Design
            </button>
          </div>
          
          <!-- Save Success Message -->
          <div v-if="saveMessage" style="
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            background-color: #10b981;
            color: white;
            text-align: center;
            font-size: 0.875rem;
          ">
            {{ saveMessage }}
          </div>
          
          <!-- Save Error Message -->
          <div v-if="saveError" style="
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            background-color: #ef4444;
            color: white;
            text-align: center;
            font-size: 0.875rem;
          ">
            {{ saveError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getProductById, getMockupImageByProductName } from "../data/products.js";
import { saveDesign as saveDesignToStorage, cleanupExpiredDesigns } from "../utils/designStorage.js";

const route = useRoute();
const productId = computed(() => route.params.id);
const product = computed(() => getProductById(productId.value));

const selectedColor = ref("");
const selectedSize = ref("");

const canvas = ref(null);
const mockupImage = ref(null);
let ctx = null;
const mockupRect = ref({ x: 0, y: 0, w: 0, h: 0 });

// Print Area Configuration
const printAreaConfig = ref({
  top: 20,    // 20% from top
  left: 15,   // 15% from left
  width: 70,  // 70% width
  height: 60  // 60% height
});

// Computed style for print area overlay (based on the actual mockup rect)
const printAreaStyle = computed(() => {
  const rect = mockupRect.value;
  const topPx = rect.y + (printAreaConfig.value.top / 100) * rect.h;
  const leftPx = rect.x + (printAreaConfig.value.left / 100) * rect.w;
  const widthPx = (printAreaConfig.value.width / 100) * rect.w;
  const heightPx = (printAreaConfig.value.height / 100) * rect.h;
  return {
    position: 'absolute',
    top: `${Math.round(topPx)}px`,
    left: `${Math.round(leftPx)}px`,
    width: `${Math.round(widthPx)}px`,
    height: `${Math.round(heightPx)}px`,
    border: '2px dashed #3b82f6',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 3
  };
});

// Function to get the appropriate mockup image
const getMockupImage = () => {
  if (product.value?.mockupImage) {
    return product.value.mockupImage;
  }
  
  if (product.value?.name) {
    return getMockupImageByProductName(product.value.name);
  }
  
  // Fallback to default
  return '/src/assets/mockup-tshirt.png';
};

const sizeCanvasToContainer = () => {
  if (!canvas.value) return;
  const container = canvas.value.parentElement;
  if (!container) return;
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width;
    canvas.value.height = height;
  }
};

const onMockupLoad = () => {
  sizeCanvasToContainer();
  updateMockupRect();
  drawPreview();
};

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext("2d");
    sizeCanvasToContainer();
  }
  updateMockupRect();
  drawPreview();
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Set default selections based on product data
  if (product.value) {
    selectedColor.value = product.value.colors?.[0] || "";
    selectedSize.value = product.value.sizes?.[0] || "";
  }
  
  // Clean up expired designs on mount
  cleanupExpiredDesigns();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  sizeCanvasToContainer();
  updateMockupRect();
  drawPreview();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const resetPrintArea = () => {
  printAreaConfig.value = {
    top: 20,
    left: 15,
    width: 70,
    height: 60
  };
};

const clamp = (value, min, max) => {
  const num = Number(value);
  if (Number.isNaN(num)) return min;
  return Math.min(max, Math.max(min, num));
};

const normalizePrintArea = () => {
  const cfg = printAreaConfig.value;
  cfg.width = clamp(cfg.width, 1, 100);
  cfg.height = clamp(cfg.height, 1, 100);
  cfg.top = clamp(cfg.top, 0, 100 - cfg.height);
  cfg.left = clamp(cfg.left, 0, 100 - cfg.width);
};

watch(printAreaConfig, () => {
  normalizePrintArea();
  drawPreview();
}, { deep: true });

const handleImageError = (event) => {
  console.error('Mockup image failed to load:', event.target.src);
  // Try fallback image
  event.target.src = '/src/assets/mockup-tshirt.png';
};
const computeContainRect = (containerW, containerH, naturalW, naturalH) => {
  if (!naturalW || !naturalH) return { x: 0, y: 0, w: containerW, h: containerH };
  const scale = Math.min(containerW / naturalW, containerH / naturalH);
  const w = Math.round(naturalW * scale);
  const h = Math.round(naturalH * scale);
  const x = Math.round((containerW - w) / 2);
  const y = Math.round((containerH - h) / 2);
  return { x, y, w, h };
};

const updateMockupRect = () => {
  if (!canvas.value || !mockupImage.value) return;
  const containerW = canvas.value.width;
  const containerH = canvas.value.height;
  const natW = mockupImage.value.naturalWidth || mockupImage.value.width || containerW;
  const natH = mockupImage.value.naturalHeight || mockupImage.value.height || containerH;
  mockupRect.value = computeContainRect(containerW, containerH, natW, natH);
};
const selectedFileName = ref("");
const fileInput = ref(null);
let designImg = null;
let designImageBase64 = null; // Store the original design image as base64

// Save design state
const isSaving = ref(false);
const saveMessage = ref("");
const saveError = ref("");

const handleUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFileName.value = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    designImageBase64 = reader.result; // Store base64 for saving
    designImg = new Image();
    designImg.onload = () => drawPreview();
    designImg.src = reader.result;
  };
  reader.readAsDataURL(file);
};

const drawPreview = () => {
  if (!ctx || !canvas.value) return;
  const c = canvas.value;
  ctx.clearRect(0, 0, c.width, c.height);
  if (!designImg) return;
  const rect = mockupRect.value;
  const area = {
    x: rect.x + (printAreaConfig.value.left / 100) * rect.w,
    y: rect.y + (printAreaConfig.value.top / 100) * rect.h,
    w: (printAreaConfig.value.width / 100) * rect.w,
    h: (printAreaConfig.value.height / 100) * rect.h
  };
  const aspect = designImg.width / designImg.height || 1;
  let dw = area.w;
  let dh = dw / aspect;
  if (dh > area.h) {
    dh = area.h;
    dw = dh * aspect;
  }
  const dx = area.x + (area.w - dw) / 2;
  const dy = area.y + (area.h - dh) / 2;
  ctx.drawImage(designImg, dx, dy, dw, dh);
};

const downloadDesign = async () => {
  if (!selectedFileName.value || !designImg || !mockupImage.value) {
    alert('Please upload a design first');
    return;
  }
  const c = document.createElement('canvas');
  c.width = canvas.value.width;
  c.height = canvas.value.height;
  const cctx = c.getContext('2d');
  // Compute export mockup rect and draw mockup
  let exportRect = { x: 0, y: 0, w: c.width, h: c.height };
  try {
    const natW = mockupImage.value.naturalWidth || mockupImage.value.width;
    const natH = mockupImage.value.naturalHeight || mockupImage.value.height;
    exportRect = computeContainRect(c.width, c.height, natW, natH);
    cctx.drawImage(mockupImage.value, exportRect.x, exportRect.y, exportRect.w, exportRect.h);
  } catch (e) {}
  const area = {
    x: exportRect.x + (printAreaConfig.value.left / 100) * exportRect.w,
    y: exportRect.y + (printAreaConfig.value.top / 100) * exportRect.h,
    w: (printAreaConfig.value.width / 100) * exportRect.w,
    h: (printAreaConfig.value.height / 100) * exportRect.h
  };
  const aspect = designImg.width / designImg.height || 1;
  let dw = area.w;
  let dh = dw / aspect;
  if (dh > area.h) {
    dh = area.h;
    dw = dh * aspect;
  }
  const dx = area.x + (area.w - dw) / 2;
  const dy = area.y + (area.h - dh) / 2;
  cctx.drawImage(designImg, dx, dy, dw, dh);
  const link = document.createElement('a');
  link.href = c.toDataURL('image/png');
  link.download = selectedFileName.value.replace(/\.[^.]+$/, '') + '_mockup.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate thumbnail from canvas (smaller preview image)
 */
const generateThumbnail = (canvas, maxWidth = 300, maxHeight = 300) => {
  const thumbCanvas = document.createElement('canvas');
  const thumbCtx = thumbCanvas.getContext('2d');
  
  const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height, 1);
  thumbCanvas.width = canvas.width * scale;
  thumbCanvas.height = canvas.height * scale;
  
  thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
  return thumbCanvas.toDataURL('image/png', 0.8);
};

/**
 * Save design to localStorage
 */
const saveDesign = async () => {
  if (!selectedFileName.value || !designImg || !mockupImage.value) {
    saveError.value = 'Please upload a design first';
    setTimeout(() => { saveError.value = ''; }, 3000);
    return;
  }
  
  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = '';
  
  try {
    // Clean up expired designs first
    cleanupExpiredDesigns();
    
    // Generate full preview canvas (mockup + design)
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = canvas.value.width;
    previewCanvas.height = canvas.value.height;
    const previewCtx = previewCanvas.getContext('2d');
    
    // Draw mockup
    let exportRect = { x: 0, y: 0, w: previewCanvas.width, h: previewCanvas.height };
    try {
      const natW = mockupImage.value.naturalWidth || mockupImage.value.width;
      const natH = mockupImage.value.naturalHeight || mockupImage.value.height;
      exportRect = computeContainRect(previewCanvas.width, previewCanvas.height, natW, natH);
      previewCtx.drawImage(mockupImage.value, exportRect.x, exportRect.y, exportRect.w, exportRect.h);
    } catch (e) {
      console.error('Error drawing mockup:', e);
    }
    
    // Draw design on mockup
    const area = {
      x: exportRect.x + (printAreaConfig.value.left / 100) * exportRect.w,
      y: exportRect.y + (printAreaConfig.value.top / 100) * exportRect.h,
      w: (printAreaConfig.value.width / 100) * exportRect.w,
      h: (printAreaConfig.value.height / 100) * exportRect.h
    };
    const aspect = designImg.width / designImg.height || 1;
    let dw = area.w;
    let dh = dw / aspect;
    if (dh > area.h) {
      dh = area.h;
      dw = dh * aspect;
    }
    const dx = area.x + (area.w - dw) / 2;
    const dy = area.y + (area.h - dh) / 2;
    previewCtx.drawImage(designImg, dx, dy, dw, dh);
    
    // Generate thumbnail
    const thumbnail = generateThumbnail(previewCanvas);
    
    // Get mockup image URL or convert to base64 if needed
    let mockupImageData = getMockupImage();
    if (mockupImage.value.complete) {
      // Try to get base64 from mockup image if possible
      try {
        const mockupCanvas = document.createElement('canvas');
        mockupCanvas.width = mockupImage.value.naturalWidth || mockupImage.value.width;
        mockupCanvas.height = mockupImage.value.naturalHeight || mockupImage.value.height;
        const mockupCtx = mockupCanvas.getContext('2d');
        mockupCtx.drawImage(mockupImage.value, 0, 0);
        mockupImageData = mockupCanvas.toDataURL('image/png');
      } catch (e) {
        // Keep original URL if conversion fails
        console.warn('Could not convert mockup to base64, using URL:', e);
      }
    }
    
    // Prepare design data
    const designData = {
      name: `${product.value?.name || 'Custom Product'} - ${selectedFileName.value}`,
      designImage: designImageBase64,
      thumbnail: thumbnail,
      mockupImage: mockupImageData,
      productName: product.value?.name || 'Custom Product',
      productPrice: product.value?.price || 100000,
      productCurrency: product.value?.currency || 'VNĐ',
      printAreaConfig: { ...printAreaConfig.value },
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value
    };
    
    // Save to localStorage
    const designId = saveDesignToStorage(designData);
    
    saveMessage.value = 'Design saved successfully! It will expire in 30 days.';
    setTimeout(() => { saveMessage.value = ''; }, 5000);
    
  } catch (error) {
    console.error('Error saving design:', error);
    if (error.message.includes('quota')) {
      saveError.value = 'Storage is full. Please delete some old designs and try again.';
    } else {
      saveError.value = error.message || 'Failed to save design. Please try again.';
    }
    setTimeout(() => { saveError.value = ''; }, 5000);
  } finally {
    isSaving.value = false;
  }
};

</script>

<style scoped>
</style>
