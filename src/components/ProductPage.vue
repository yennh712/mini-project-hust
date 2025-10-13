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
                  style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem;"
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
                  style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem;"
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
                  style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem;"
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
                  style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem;"
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

          <!-- File Upload (display only, no behavior) -->
          <div class="form-section">
            <label class="form-label">Upload Design:</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                accept="image/*"
                class="file-upload-input"
                id="file-upload"
                disabled
              />
              <label for="file-upload" class="file-upload-button" style="opacity: 0.7; cursor: not-allowed;">
                <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span class="file-upload-text">Choose File</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons (display only, no behavior) -->
          <div class="form-section" style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button 
              class="download-button"
              style="
                padding: 0.75rem 1.5rem;
                background-color: #10b981;
                color: white;
                border-radius: 0.5rem;
                border: none;
                cursor: not-allowed;
                opacity: 0.7;
                transition: background-color 0.2s;
                flex: 1;
                min-width: 150px;
              "
              disabled
            >
              <svg style="width: 1rem; height: 1rem; margin-right: 0.5rem; display: inline-block; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Design
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getProductById, getMockupImageByProductName } from "../data/products.js";

const route = useRoute();
const productId = computed(() => route.params.id);
const product = computed(() => getProductById(productId.value));

const selectedColor = ref("");
const selectedSize = ref("");

const canvas = ref(null);
const mockupImage = ref(null);
let ctx = null;

// Print Area Configuration
const printAreaConfig = ref({
  top: 20,    // 20% from top
  left: 15,   // 15% from left
  width: 70,  // 70% width
  height: 60  // 60% height
});

// Computed style for print area overlay
const printAreaStyle = computed(() => ({
  position: 'absolute',
  top: `${printAreaConfig.value.top}%`,
  left: `${printAreaConfig.value.left}%`,
  width: `${printAreaConfig.value.width}%`,
  height: `${printAreaConfig.value.height}%`,
  border: '2px dashed #3b82f6',
  borderRadius: '0.5rem',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 1
}));

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

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext("2d");
    // Set canvas size to match the mockup container
    const container = canvas.value.parentElement;
    canvas.value.width = container.offsetWidth;
    canvas.value.height = container.offsetHeight;
  }
  
  // Set default selections based on product data
  if (product.value) {
    selectedColor.value = product.value.colors?.[0] || "";
    selectedSize.value = product.value.sizes?.[0] || "";
  }
});

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

const handleImageError = (event) => {
  console.error('Mockup image failed to load:', event.target.src);
  // Try fallback image
  event.target.src = '/src/assets/mockup-tshirt.png';
};
// Upload/Download logic removed per request

</script>

<style scoped>
</style>
