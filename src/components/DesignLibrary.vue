<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 class="text-4xl font-bold">My Design Library</h1>
        <button 
          @click="$router.push('/')"
          style="
            padding: 0.5rem 1rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
          "
        >
          ← Back to Home
        </button>
      </div>

      <!-- Search and Sort Controls -->
      <div style="
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      ">
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center;">
          <!-- Search Input -->
          <div style="position: relative;">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by product name..."
              style="
                width: 100%;
                padding: 0.75rem 2.5rem 0.75rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 1rem;
                color: #111827;
              "
            />
            <svg 
              v-if="searchQuery"
              @click="searchQuery = ''"
              style="
                position: absolute;
                right: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1.25rem;
                height: 1.25rem;
                color: #6b7280;
                cursor: pointer;
              "
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg 
              v-else
              style="
                position: absolute;
                right: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1.25rem;
                height: 1.25rem;
                color: #6b7280;
              "
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Sort Dropdown -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label style="
              font-size: 0.875rem;
              color: #6b7280;
              white-space: nowrap;
            ">Sort by:</label>
            <select
              v-model="sortOrder"
              style="
                padding: 0.75rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                color: #111827;
                background-color: white;
                cursor: pointer;
                min-width: 180px;
              "
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Results Count -->
        <div v-if="filteredDesigns.length > 0" style="
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        ">
          Showing {{ filteredDesigns.length }} design{{ filteredDesigns.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDesigns.length === 0 && !isLoading" style="
        text-align: center;
        padding: 4rem 2rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      ">
        <svg style="
          width: 4rem;
          height: 4rem;
          color: #9ca3af;
          margin: 0 auto 1rem;
          display: block;
        " fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 style="
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        ">
          {{ searchQuery ? 'No designs found' : 'No designs saved yet' }}
        </h3>
        <p style="
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        ">
          {{ searchQuery ? 'Try adjusting your search query' : 'Start creating and saving your designs to see them here' }}
        </p>
        <button 
          v-if="!searchQuery"
          @click="$router.push('/')"
          style="
            padding: 0.75rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
          "
        >
          Browse Products
        </button>
      </div>

      <!-- Design Table -->
      <div v-if="filteredDesigns.length > 0" style="
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        overflow: hidden;
      ">
        <table style="
          width: 100%;
          border-collapse: collapse;
        ">
          <thead>
            <tr style="
              background-color: #f9fafb;
              border-bottom: 2px solid #e5e7eb;
            ">
              <th style="
                padding: 1rem;
                text-align: center;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                width: 60px;
              ">#</th>
              <th style="
                padding: 1rem;
                text-align: center;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                width: 120px;
              ">Thumbnail</th>
              <th style="
                padding: 1rem;
                text-align: center;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
              ">Product Name</th>
              <th style="
                padding: 1rem;
                text-align: center;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                width: 180px;
              ">Created At</th>
              <th style="
                padding: 1rem;
                text-align: center;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                width: 200px;
              ">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(design, index) in filteredDesigns"
              :key="design.id"
              style="
                border-bottom: 1px solid #e5e7eb;
                transition: background-color 0.2s;
              "
              @mouseover="this.style.backgroundColor='#f9fafb'"
              @mouseout="this.style.backgroundColor='white'"
            >
              <!-- Số thứ tự -->
              <td style="
                padding: 1rem;
                font-size: 0.875rem;
                color: #6b7280;
                text-align: center;
              ">
                {{ index + 1 }}
              </td>
              
              <!-- Thumbnail -->
              <td style="padding: 1rem; text-align: center;">
                <div style="
                  position: relative;
                  width: 100px;
                  height: 100px;
                  background-color: #f3f4f6;
                  border-radius: 0.375rem;
                  overflow: hidden;
                  border: 1px solid #e5e7eb;
                  margin: 0 auto;
                ">
                  <img 
                    :src="design.thumbnail" 
                    :alt="design.productName"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                    "
                    @error="handleImageError"
                  />
                  <!-- Expiry Badge -->
                  <div v-if="getDaysUntilExpiry(design.expiresAt) <= 7" style="
                    position: absolute;
                    top: 0.25rem;
                    right: 0.25rem;
                    background-color: rgba(239, 68, 68, 0.9);
                    color: white;
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                    font-size: 0.625rem;
                    font-weight: 500;
                  ">
                    {{ getDaysUntilExpiry(design.expiresAt) }}d
                  </div>
                </div>
              </td>
              
              <!-- Product Name -->
              <td style="padding: 1rem; text-align: center;">
                <div style="
                  font-size: 0.875rem;
                  font-weight: 600;
                  color: #111827;
                  margin-bottom: 0.25rem;
                ">{{ design.productName }}</div>
                <div style="
                  font-size: 0.75rem;
                  color: #6b7280;
                ">{{ formatPrice(design.productPrice) }} {{ design.productCurrency }}</div>
              </td>
              
              <!-- Created At -->
              <td style="padding: 1rem; text-align: center;">
                <div style="
                  font-size: 0.875rem;
                  color: #374151;
                ">{{ formatDate(design.createdAt) }}</div>
                <div style="
                  font-size: 0.75rem;
                  color: #9ca3af;
                  margin-top: 0.25rem;
                ">{{ formatTime(design.createdAt) }}</div>
              </td>
              
              <!-- Actions -->
              <td style="padding: 1rem; text-align: center;">
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                  <button
                    @click="downloadDesign(design)"
                    style="
                      padding: 0.5rem 1rem;
                      background-color: #10b981;
                      color: white;
                      border: none;
                      border-radius: 0.375rem;
                      cursor: pointer;
                      font-size: 0.875rem;
                      font-weight: 500;
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      transition: background-color 0.2s;
                    "
                    @mouseover="this.style.backgroundColor='#059669'"
                    @mouseout="this.style.backgroundColor='#10b981'"
                  >
                    <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download
                  </button>
                  <button
                    @click="deleteDesignConfirm(design)"
                    style="
                      padding: 0.5rem 1rem;
                      background-color: #ef4444;
                      color: white;
                      border: none;
                      border-radius: 0.375rem;
                      cursor: pointer;
                      font-size: 0.875rem;
                      font-weight: 500;
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      transition: background-color 0.2s;
                    "
                    @mouseover="this.style.backgroundColor='#dc2626'"
                    @mouseout="this.style.backgroundColor='#ef4444'"
                  >
                    <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="designToDelete"
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
      @click.self="designToDelete = null"
    >
      <div style="
        background-color: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      ">
        <h3 style="
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        ">Delete Design?</h3>
        <p style="
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        ">Are you sure you want to delete this design? This action cannot be undone.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button
            @click="designToDelete = null"
            style="
              padding: 0.5rem 1rem;
              background: none;
              border: 1px solid #d1d5db;
              border-radius: 0.375rem;
              color: #374151;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
            "
          >Cancel</button>
          <button
            @click="confirmDelete"
            style="
              padding: 0.5rem 1rem;
              background-color: #ef4444;
              color: white;
              border: none;
              border-radius: 0.375rem;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
            "
          >Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getSavedDesigns, 
  deleteDesign as deleteDesignFromStorage,
  cleanupExpiredDesigns 
} from '../utils/designStorage.js';

const router = useRouter();

const designs = ref([]);
const searchQuery = ref('');
const sortOrder = ref('newest');
const isLoading = ref(true);
const designToDelete = ref(null);

// Load designs on mount
onMounted(() => {
  loadDesigns();
  cleanupExpiredDesigns();
});

const loadDesigns = () => {
  isLoading.value = true;
  try {
    designs.value = getSavedDesigns();
  } catch (error) {
    console.error('Error loading designs:', error);
    designs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Filter designs by search query
const filteredDesigns = computed(() => {
  let filtered = designs.value;

  // Filter by search query (product name)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(design => 
      design.productName.toLowerCase().includes(query) ||
      design.name.toLowerCase().includes(query)
    );
  }

  // Sort by time
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return b.createdAt - a.createdAt; // Newest first
    } else {
      return a.createdAt - b.createdAt; // Oldest first
    }
  });

  return sorted;
});

// Format date
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// Get days until expiry
const getDaysUntilExpiry = (expiresAt) => {
  if (!expiresAt) return 999;
  const now = Date.now();
  const diff = expiresAt - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
};

// Delete design confirmation
const deleteDesignConfirm = (design) => {
  designToDelete.value = design;
};

// Confirm delete
const confirmDelete = () => {
  if (!designToDelete.value) return;
  
  const success = deleteDesignFromStorage(designToDelete.value.id);
  if (success) {
    loadDesigns(); // Reload designs
    designToDelete.value = null;
  } else {
    alert('Failed to delete design. Please try again.');
  }
};

// Download design - creates full preview from saved data
const downloadDesign = async (design) => {
  try {
    // Create canvas to render full preview
    const canvas = document.createElement('canvas');
    canvas.width = 1200; // Standard width for mockup
    canvas.height = 1200; // Standard height for mockup
    const ctx = canvas.getContext('2d');
    
    // Load mockup image
    const mockupImg = new Image();
    mockupImg.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      mockupImg.onload = () => {
        try {
          // Draw mockup (scaled to fit canvas)
          const scale = Math.min(canvas.width / mockupImg.width, canvas.height / mockupImg.height);
          const scaledWidth = mockupImg.width * scale;
          const scaledHeight = mockupImg.height * scale;
          const x = (canvas.width - scaledWidth) / 2;
          const y = (canvas.height - scaledHeight) / 2;
          
          ctx.drawImage(mockupImg, x, y, scaledWidth, scaledHeight);
          
          // Calculate print area
          const mockupRect = { x, y, w: scaledWidth, h: scaledHeight };
          const area = {
            x: mockupRect.x + (design.printAreaConfig.left / 100) * mockupRect.w,
            y: mockupRect.y + (design.printAreaConfig.top / 100) * mockupRect.h,
            w: (design.printAreaConfig.width / 100) * mockupRect.w,
            h: (design.printAreaConfig.height / 100) * mockupRect.h
          };
          
          // Load and draw design image
          const designImg = new Image();
          designImg.crossOrigin = 'anonymous';
          designImg.onload = () => {
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
            
            // Download
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${design.productName.replace(/[^a-z0-9]/gi, '_')}_${design.id}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            }, 'image/png');
          };
          designImg.onerror = reject;
          designImg.src = design.designImage;
        } catch (e) {
          reject(e);
        }
      };
      mockupImg.onerror = reject;
      mockupImg.src = design.mockupImage;
    });
  } catch (error) {
    console.error('Error downloading design:', error);
    // Fallback: download thumbnail if full preview fails
    try {
      const link = document.createElement('a');
      link.href = design.thumbnail;
      link.download = `${design.productName.replace(/[^a-z0-9]/gi, '_')}_${design.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      alert('Failed to download design. Please try again.');
    }
  }
};

</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.font-bold {
  font-weight: 700;
}

@media (max-width: 640px) {
  .design-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>

