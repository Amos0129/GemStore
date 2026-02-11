<template>
  <div class="product-card">
    <!-- Product Badge -->
    <span 
      v-if="product.badge" 
      class="product-badge"
      :class="badgeClass"
    >
      {{ badgeText }}
    </span>
    
    <!-- Wishlist Button -->
    <button 
      class="wishlist-btn"
      :class="{ active: isWishlisted }"
      @click="$emit('toggle-wishlist', product)"
    >
      <i class="fas fa-heart"></i>
    </button>
    
    <!-- Product Image -->
    <div class="product-image" @click="navigateToProduct">
      <img 
        v-if="productImage" 
        :src="productImage" 
        :alt="product.name"
        class="main-image"
      />
      <div v-else class="placeholder-image">
        <i :class="product.icon || 'fas fa-gem'" class="placeholder-icon"></i>
      </div>
      
      <!-- Quick View Overlay -->
      <div class="quick-view-overlay">
        <button class="quick-view-btn" @click="openQuickView">
          <i class="fas fa-eye"></i> 快速查看
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="product-info">
      <h3 class="product-name" @click="navigateToProduct">
        {{ product.name }}
      </h3>
      
      <div class="product-rating" v-if="product.rating > 0">
        <div class="stars">
          <i 
            v-for="i in 5" 
            :key="i"
            class="fas fa-star"
            :class="{ 
              'text-yellow-400': i <= product.rating,
              'text-gray-400': i > product.rating 
            }"
          ></i>
        </div>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>
      
      <div class="product-price">
        <span class="current-price">${{ product.price }}</span>
        <span 
          v-if="product.originalPrice && product.originalPrice > product.price" 
          class="original-price"
        >
          ${{ product.originalPrice }}
        </span>
        <span 
          v-if="discountPercentage > 0" 
          class="discount-badge"
        >
          -{{ discountPercentage }}%
        </span>
      </div>
      
      <div class="product-actions">
        <button 
          class="add-cart-btn"
          :disabled="product.stock === 0"
          @click="$emit('add-to-cart', product)"
        >
          <i class="fas fa-cart-plus"></i>
          {{ product.stock === 0 ? '缺貨' : '加入購物車' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isWishlisted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart', 'toggle-wishlist', 'quick-view'])

const router = useRouter()

const productImage = computed(() => {
  // 支持新的 images 陣列格式和舊的 image 字串格式
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[0]
  }
  return props.product.image
})

const badgeClass = computed(() => {
  const badges = {
    'new': 'bg-emerald-300',
    'hot': 'bg-rose-300', 
    'sale': 'bg-orange-300',
    'limited': 'bg-violet-300'
  }
  return badges[props.product.badge] || 'bg-sky-300'
})

const badgeText = computed(() => {
  const texts = {
    'new': '新品',
    'hot': '熱銷',
    'sale': '限時',
    'limited': '限量'
  }
  return texts[props.product.badge] || '特惠'
})

const discountPercentage = computed(() => {
  if (props.product.originalPrice && props.product.originalPrice > props.product.price) {
    return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100)
  }
  return 0
})

const navigateToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const openQuickView = (event) => {
  event.stopPropagation()
  emit('quick-view', props.product)
}
</script>

<style scoped>
.product-card {
  @apply relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2;
  background-color: #FAF5FF;
  border: 1px solid #E9D5FF;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.08);
}

.product-card:hover {
  border-color: #C4B5FD;
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.15);
}

.product-badge {
  @apply absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium z-10;
  color: #581C87;
}

.wishlist-btn {
  @apply absolute top-3 right-3 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 z-10;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #C4B5FD;
  color: #8B5CF6;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background-color: #C4B5FD;
  border-color: #C4B5FD;
  color: white;
}

.product-image {
  @apply relative h-64 overflow-hidden cursor-pointer;
}

.main-image {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.placeholder-image {
  @apply w-full h-full flex items-center justify-center;
  background-color: #F5F5F5;
}

.placeholder-icon {
  @apply text-6xl;
  color: #8B5CF6;
}

.quick-view-overlay {
  @apply absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300;
  background-color: rgba(196, 181, 253, 0.8);
}

.quick-view-btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-300;
  background-color: #FFFFFF;
  color: #581C87;
}

.product-info {
  @apply p-6;
}

.product-name {
  @apply text-lg font-semibold mb-2 cursor-pointer transition-colors duration-300;
  color: #581C87;
}

.product-name:hover {
  color: #8B5CF6;
}

.product-rating {
  @apply flex items-center space-x-2 mb-3;
}

.stars {
  @apply flex space-x-1;
}

.rating-count {
  @apply text-sm;
  color: #9CA3AF;
}

.product-price {
  @apply flex items-center space-x-2 mb-4;
}

.current-price {
  @apply text-2xl font-bold;
  color: #8B5CF6;
}

.original-price {
  @apply line-through;
  color: #9CA3AF;
}

.discount-badge {
  @apply px-2 py-1 rounded text-xs font-medium;
  background-color: #C4B5FD;
  color: #581C87;
}

.product-actions {
  @apply space-y-2;
}

.add-cart-btn {
  @apply w-full font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2;
  background: linear-gradient(135deg, #C4B5FD 0%, #DDD6FE 100%);
  color: #581C87;
  border: 1px solid #C4B5FD;
}

.add-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  border-color: #8B5CF6;
}

.add-cart-btn:disabled {
  @apply cursor-not-allowed;
  background: #F5F5F5;
  color: #9CA3AF;
  border-color: #E5E7EB;
}

/* Stock status indicator */
.product-card::before {
  content: '';
  @apply absolute top-0 left-0 w-full h-1;
  background: linear-gradient(90deg, #C4B5FD 0%, #DDD6FE 100%);
}

.product-card:has(.add-cart-btn:disabled)::before {
  background-color: #E5E7EB;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .product-card {
    @apply rounded-xl;
    min-width: 280px;
    flex-shrink: 0;
    snap-align: start;
  }
  
  .product-badge {
    @apply top-2 left-2 px-2 py-1 text-xs;
  }
  
  .wishlist-btn {
    @apply top-2 right-2 w-7 h-7;
  }
  
  .product-image {
    @apply h-48;
  }
  
  .quick-view-overlay {
    @apply opacity-100;
    background-color: rgba(196, 181, 253, 0.6);
  }
  
  .quick-view-btn {
    @apply px-3 py-1.5 text-sm;
  }
  
  .product-info {
    @apply p-4;
  }
  
  .product-name {
    @apply text-base mb-2;
  }
  
  .product-rating {
    @apply mb-2;
  }
  
  .rating-count {
    @apply text-xs;
  }
  
  .product-price {
    @apply mb-3;
  }
  
  .current-price {
    @apply text-xl;
  }
  
  .original-price {
    @apply text-sm;
  }
  
  .discount-badge {
    @apply px-1.5 py-0.5 text-xs;
  }
  
  .add-cart-btn {
    @apply py-2.5 text-sm;
  }
}

@media (max-width: 480px) {
  .product-card {
    @apply rounded-lg;
    min-width: 260px;
  }
  
  .product-image {
    @apply h-40;
  }
  
  .product-info {
    @apply p-3;
  }
  
  .product-name {
    @apply text-sm mb-1.5 leading-tight;
  }
  
  .product-rating {
    @apply mb-2 space-x-1;
  }
  
  .stars {
    @apply space-x-0.5;
  }
  
  .stars i {
    @apply text-xs;
  }
  
  .rating-count {
    @apply text-xs;
  }
  
  .product-price {
    @apply mb-2 space-x-1;
  }
  
  .current-price {
    @apply text-lg;
  }
  
  .original-price {
    @apply text-xs;
  }
  
  .discount-badge {
    @apply px-1 py-0.5 text-xs;
  }
  
  .add-cart-btn {
    @apply py-2 text-xs px-3;
  }
  
  .add-cart-btn i {
    @apply text-xs;
  }
}
</style>