<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div style="flex: 1;"></div>
        <h1 class="text-4xl font-bold text-center" style="flex: 2;">Choose Your Product</h1>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <button 
            @click="$router.push('/library')"
            style="
              padding: 0.5rem 1rem;
              background-color: #6b7280;
              color: white;
              border: none;
              border-radius: 0.375rem;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            "
          >
            <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            My Designs
          </button>
        </div>
      </div>
      <p class="text-center text-gray-600 mb-12">Select a product to customize with your design</p>
      
      <!-- Debug info -->
      <div v-if="!products || products.length === 0" class="text-center text-red-500 mb-4">
        No products found. Check console for errors.
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div 
          v-for="product in products" 
          :key="product.id"
          @click="selectProduct(product)"
          @mousedown="console.log('Mouse down on product:', product.id)"
          @mouseup="console.log('Mouse up on product:', product.id)"
          class="product-card"
          style="
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          "
          @mouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px -3px rgba(0, 0, 0, 0.1)'; this.style.borderColor='#3b82f6'"
          @mouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'; this.style.borderColor='transparent'"
        >
          <div class="product-image" style="position: relative; aspect-ratio: 1/1; width: 100%;">
            <img 
              :src="getProductImage(product)" 
              :alt="product.name"
              style="
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                border-radius: 0.5rem 0.5rem 0 0;
              "
              @error="(e) => handleImageError(e, product)"
            />
            <!-- Print Area Overlay -->
            <div class="print-area-overlay" style="
              position: absolute;
              top: 20%;
              left: 15%;
              width: 70%;
              height: 60%;
              border: 2px dashed #3b82f6;
              border-radius: 0.5rem;
              background-color: rgba(59, 130, 246, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: none;
            ">
              <span style="
                color: #3b82f6;
                font-size: 0.75rem;
                font-weight: 500;
                background-color: rgba(255, 255, 255, 0.9);
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
              ">
                Print Area
              </span>
            </div>
          </div>
          <div class="product-info" style="padding: 1rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">{{ product.name }}</h3>
            <p style="font-size: 1.25rem; font-weight: 700; color: #2563eb; margin-bottom: 0.5rem;">{{ formatPrice(product.price) }} {{ product.currency }}</p>
            <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ product.description }}</p>
            <div style="font-size: 0.75rem;">
              <span style="color: #6b7280;">Available colors:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.25rem;">
                <span 
                  v-for="color in product.colors.slice(0, 3)" 
                  :key="color"
                  style="display: inline-block; padding: 0.25rem 0.5rem; background-color: #f3f4f6; color: #374151; border-radius: 0.25rem; font-size: 0.75rem;"
                >
                  {{ color }}
                </span>
                <span v-if="product.colors.length > 3" style="display: inline-block; padding: 0.25rem 0.5rem; background-color: #f3f4f6; color: #374151; border-radius: 0.25rem; font-size: 0.75rem;">
                  +{{ product.colors.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Mockup Option -->
      <div class="custom-mockup-section" style="
        margin-top: 3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <p style="
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          font-weight: 400;
        ">or</p>
        <button 
          class="custom-mockup-button"
          style="
            background-color: #e5e7eb;
            color: #374151;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            display: inline-block;
          "
          @mouseover="this.style.backgroundColor='#d1d5db'"
          @mouseout="this.style.backgroundColor='#e5e7eb'"
          @click="openCustomMockupModal"
        >
          Choose Your Custom Mockup
        </button>
        <p style="
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 0.5rem;
          text-align: center;
          max-width: 400px;
        ">(You can upload your mockup or choose a mockup from our library)</p>
      </div>
    </div>

    <!-- Custom Mockup Modal -->
    <div 
      v-if="showModal" 
      class="modal-overlay"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      "
      @click.self="closeModal"
    >
      <div class="modal-content" style="
        background-color: white;
        border-radius: 0.5rem;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        position: relative;
      ">
        <!-- Modal Header -->
        <div style="
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
          ">Choose Your Custom Mockup</h2>
          <button 
            @click="closeModal"
            style="
              background: none;
              border: none;
              font-size: 1.5rem;
              color: #6b7280;
              cursor: pointer;
              padding: 0.25rem 0.5rem;
              line-height: 1;
            "
          >&times;</button>
        </div>

        <!-- Modal Tabs -->
        <div style="
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        ">
          <button
            @click="activeTab = 'upload'"
            :style="{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'upload' ? 'white' : '#f9fafb',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'upload' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'upload' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '1rem'
            }"
          >
            Upload Mockup
          </button>
          <button
            @click="activeTab = 'library'"
            :style="{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'library' ? 'white' : '#f9fafb',
              border: 'none',
              borderBottom: activeTab === 'library' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'library' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'library' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '1rem'
            }"
          >
            Choose from Library
          </button>
        </div>

        <!-- Modal Body -->
        <div style="padding: 1.5rem;">
          <!-- Upload Tab -->
          <div v-if="activeTab === 'upload'">
            <div 
              class="upload-area"
              :style="{
                border: isDragging ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
                borderRadius: '0.5rem',
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: isDragging ? '#eff6ff' : '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                style="display: none"
                @change="handleFileSelect"
              />
              <svg style="
                width: 3rem;
                height: 3rem;
                color: #6b7280;
                margin: 0 auto 1rem;
                display: block;
              " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p style="
                color: #374151;
                fontSize: '1rem';
                fontWeight: '500';
                marginBottom: '0.5rem';
              ">Drag and drop your mockup here</p>
              <p style="
                color: #6b7280;
                fontSize: '0.875rem';
                marginBottom: '1rem';
              ">or</p>
              <button style="
                background-color: #3b82f6;
                color: white;
                border: none;
                margin: 1rem;
                padding: '0.5rem 1.5rem';
                borderRadius: '0.375rem';
                fontSize: '0.875rem';
                fontWeight: '500';
                cursor: 'pointer';
              ">Browse Files</button>
              <p style="
                color: #6b7280;
                fontSize: '0.75rem';
                marginTop: '1rem';
              ">PNG or JPG, max 5MB</p>
              <p v-if="uploadError" style="
                marginTop: '1rem';
                color: '#ef4444';
                fontSize: '0.875rem';
              ">{{ uploadError }}</p>
            </div>
            <div v-if="previewImage" style="
              marginTop: '1rem';
              textAlign: 'center';
            ">
              <img 
                :src="previewImage" 
                alt="Preview"
                style="
                  maxWidth: '100%';
                  maxHeight: '300px';
                  borderRadius: '0.5rem';
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                "
              />
            </div>
          </div>

          <!-- Library Tab -->
          <div v-if="activeTab === 'library'">
            <div class="mockup-library" style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 1rem;
              max-height: 400px;
              overflow-y: auto;
              padding: 0.5rem;
            ">
              <div
                v-for="mockup in allAvailableMockups"
                :key="mockup.id"
                @click="selectMockupFromLibrary(mockup)"
                :style="{
                  border: selectedLibraryMockup?.id === mockup.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedLibraryMockup?.id === mockup.id ? '#eff6ff' : 'white'
                }"
                @mouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
                @mouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
              >
                <img 
                  :src="mockup.image" 
                  :alt="mockup.name"
                  style="
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                  "
                  @error="handleMockupImageError"
                />
                <p style="
                  padding: 0.5rem;
                  font-size: 0.875rem;
                  color: #374151;
                  text-align: center;
                  margin: 0;
                ">{{ mockup.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div style="
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: center;
          gap: 1rem;
        ">
          <button 
            @click="closeModal"
            style="
              padding: 0.75rem 2rem;
              background: none;
              border: 1px solid #d1d5db;
              border-radius: 0.375rem;
              color: #374151;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              min-width: 120px;
              transition: all 0.2s;
            "
            @mouseover="this.style.backgroundColor='#f9fafb'; this.style.borderColor='#9ca3af'"
            @mouseout="this.style.backgroundColor='transparent'; this.style.borderColor='#d1d5db'"
          >Cancel</button>
          <button 
            @click="submitCustomMockup"
            :disabled="!canSubmit"
            :style="{
              padding: '0.75rem 2rem',
              backgroundColor: canSubmit ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontSize: '0.875rem',
              fontWeight: '500',
              minWidth: '120px',
              transition: 'all 0.2s'
            }"
            @mouseover="canSubmit && (this.style.backgroundColor='#2563eb')"
            @mouseout="canSubmit && (this.style.backgroundColor='#3b82f6')"
          >Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { products, allAvailableMockups } from '../data/products.js';
import { saveCustomMockup, validateMockupFile } from '../utils/mockupStorage.js';

const router = useRouter();

// Modal state
const showModal = ref(false);
const activeTab = ref('upload');
const isDragging = ref(false);
const fileInput = ref(null);
const selectedFile = ref(null);
const previewImage = ref(null);
const uploadError = ref('');
const selectedLibraryMockup = ref(null);

// Debug: Log products to console
onMounted(() => {
  console.log('Products loaded:', products);
  console.log('Router available:', !!router);
  console.log('Products count:', products.length);
});

const selectProduct = (product) => {
  console.log('Product clicked:', product);
  console.log('Navigating to:', `/product/${product.id}`);
  
  try {
    router.push(`/product/${product.id}`);
    console.log('Navigation successful');
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// Helper function to get product image (similar to ProductPage)
const getProductImage = (product) => {
  // Use image or mockupImage, both should be imported URLs now
  if (product?.image) {
    return product.image;
  }
  if (product?.mockupImage) {
    return product.mockupImage;
  }
  // Final fallback - this should be imported too
  return '/src/assets/mockup_tshirt_white.png';
};

const handleImageError = (event, product) => {
  const failedSrc = event.target.src;
  console.error(`[HomePage] Image failed to load for ${product?.name || 'unknown'}:`, failedSrc);
  
  // Prevent infinite loop
  if (event.target.dataset.isFallback === 'true') {
    console.warn('[HomePage] Fallback also failed, showing placeholder');
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
    event.target.style.display = 'block';
    return;
  }
  
  // Try to use mockupImage as fallback if available
  if (product && product.mockupImage && failedSrc !== product.mockupImage) {
    console.log(`[HomePage] Trying fallback to mockupImage for ${product.name}:`, product.mockupImage);
    event.target.dataset.isFallback = 'true';
    event.target.src = product.mockupImage;
    return;
  }
  
  // Try default fallback
  if (failedSrc !== '/src/assets/mockup_tshirt_white.png') {
    console.log('[HomePage] Trying default fallback');
    event.target.dataset.isFallback = 'true';
    event.target.src = '/src/assets/mockup_tshirt_white.png';
    return;
  }
  
  // Final fallback: show placeholder
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
  event.target.style.display = 'block';
};

// Modal functions
const openCustomMockupModal = () => {
  showModal.value = true;
  activeTab.value = 'upload';
  selectedFile.value = null;
  previewImage.value = null;
  uploadError.value = '';
  selectedLibraryMockup.value = null;
};

const closeModal = () => {
  showModal.value = false;
  selectedFile.value = null;
  previewImage.value = null;
  uploadError.value = '';
  selectedLibraryMockup.value = null;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = (file) => {
  uploadError.value = '';
  
  // Validate file
  const validation = validateMockupFile(file);
  if (!validation.valid) {
    uploadError.value = validation.error;
    return;
  }

  selectedFile.value = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const selectMockupFromLibrary = (mockup) => {
  selectedLibraryMockup.value = {
    id: `library_${mockup.id}`,
    name: mockup.name,
    image: mockup.image,
    isLibrary: true,
    mockupId: mockup.id
  };
};

const handleMockupImageError = (event) => {
  console.error('Mockup image failed to load:', event.target.src);
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
};

const canSubmit = computed(() => {
  if (activeTab.value === 'upload') {
    return selectedFile.value !== null;
  } else {
    return selectedLibraryMockup.value !== null;
  }
});

const submitCustomMockup = async () => {
  try {
    let mockupData = null;

    if (activeTab.value === 'upload') {
      if (!selectedFile.value) {
        uploadError.value = 'Please select a file';
        return;
      }

      // Save custom mockup
      mockupData = await saveCustomMockup(selectedFile.value);
    } else {
      // Use library mockup
      if (!selectedLibraryMockup.value) {
        return;
      }
      mockupData = {
        id: selectedLibraryMockup.value.id,
        name: selectedLibraryMockup.value.name,
        image: selectedLibraryMockup.value.image,
        isLibrary: true
      };
    }

    // Store mockup data in sessionStorage for navigation
    sessionStorage.setItem('customMockupData', JSON.stringify(mockupData));
    
    // Navigate to custom product page
    router.push('/product/custom');
    
    closeModal();
  } catch (error) {
    console.error('Error submitting mockup:', error);
    uploadError.value = error.message || 'Failed to process mockup. Please try again.';
  }
};
</script>

<style scoped>
/* Fallback styles in case Tailwind doesn't work */
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.mb-8 {
  margin-bottom: 2rem;
}

.text-gray-600 {
  color: #4b5563;
}

.mb-12 {
  margin-bottom: 3rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-6 {
  gap: 1.5rem;
}

.max-w-6xl {
  max-width: 72rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>


