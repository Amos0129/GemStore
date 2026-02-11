<template>
  <section class="product-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
        <router-link 
          v-if="showViewAll" 
          to="/products" 
          class="view-all-btn"
        >
          查看全部 <i class="fas fa-arrow-right ml-2"></i>
        </router-link>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-grid">
        <ProductCardSkeleton 
          v-for="i in 8" 
          :key="i" 
        />
      </div>
      
      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="products-grid">
        <ProductCard 
          v-for="product in displayProducts" 
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
          @toggle-wishlist="handleToggleWishlist"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="fas fa-box-open text-6xl text-gray-500 mb-4"></i>
        <p class="text-gray-500 text-lg">目前沒有商品</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/composables/useToast'

import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showViewAll: {
    type: Boolean,
    default: true
  },
  maxItems: {
    type: Number,
    default: 8
  }
})

const cartStore = useCartStore()
const { showToast } = useToast()

const displayProducts = computed(() => {
  return props.products.slice(0, props.maxItems)
})

const handleAddToCart = (product) => {
  cartStore.addItem(product)
  showToast(`${product.name} 已加入購物車`, 'success')
}

const handleToggleWishlist = (product) => {
  // TODO: 實現願望清單功能
  showToast(`${product.name} 已加入收藏`, 'success')
}
</script>

<style scoped>
.product-section {
  @apply py-20;
  background-color: #FFFFFF;
}

.product-section:nth-child(odd) {
  background-color: #FFFFFF;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-header {
  @apply flex justify-between items-center mb-12;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold;
  color: #8B5CF6;
}

.view-all-btn {
  @apply font-medium flex items-center transition-colors duration-300;
  color: #C4B5FD;
}

.view-all-btn:hover {
  color: #F8BBD9;
}

.products-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Mobile horizontal scroll */
@media (max-width: 767px) {
  .products-grid {
    @apply flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding-left: 16px;
    padding-right: 16px;
    margin-left: -16px;
    margin-right: -16px;
  }
  
  .products-grid::-webkit-scrollbar {
    height: 4px;
    margin-top: 8px;
  }
  
  .products-grid::-webkit-scrollbar-track {
    background: rgba(196, 181, 253, 0.15);
    border-radius: 2px;
  }
  
  .products-grid::-webkit-scrollbar-thumb {
    background: #C4B5FD;
    border-radius: 2px;
  }
  
  .products-grid::-webkit-scrollbar-thumb:hover {
    background: #8B5CF6;
  }
}

.loading-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Mobile horizontal scroll for loading */
@media (max-width: 767px) {
  .loading-grid {
    @apply flex overflow-x-auto gap-4 pb-4;
  }
}

.empty-state {
  @apply text-center py-20;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .product-section {
    @apply py-12;
  }
  
  .container {
    @apply px-3;
  }
  
  .section-header {
    @apply flex-col space-y-3 items-start mb-8;
  }
  
  .section-title {
    @apply text-2xl;
  }
  
  .view-all-btn {
    @apply text-sm;
  }
  
  /* Desktop override for mobile horizontal scroll */
  .products-grid {
    @apply grid-cols-1 sm:grid-cols-2 gap-4;
  }
  
  .loading-grid {
    @apply grid-cols-1 sm:grid-cols-2 gap-4;
  }
}

@media (max-width: 480px) {
  .product-section {
    @apply py-10;
  }
  
  .section-header {
    @apply mb-6;
  }
  
  .section-title {
    @apply text-xl;
  }
  
  /* Mobile keeps horizontal scroll */
}
</style>