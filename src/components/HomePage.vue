<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">Choose Your Product</h1>
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
              :src="product.image" 
              :alt="product.name"
              style="
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                border-radius: 0.5rem 0.5rem 0 0;
              "
              @error="handleImageError"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { products } from '../data/products.js';

const router = useRouter();

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

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  // Set a fallback image or hide the image
  event.target.style.display = 'none';
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


