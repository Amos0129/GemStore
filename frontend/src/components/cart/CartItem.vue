<template>
  <div class="cart-item">
    <!-- Product Image -->
    <div class="item-image">
      <img 
        v-if="item.image" 
        :src="item.image" 
        :alt="item.name"
        class="product-image"
      />
      <div v-else class="placeholder-image">
        <i :class="item.icon || 'fas fa-gem'"></i>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="item-info">
      <h4 class="item-name">{{ item.name }}</h4>
      <p class="item-price">${{ item.price }}</p>
      
      <!-- Quantity Controls -->
      <div class="quantity-control">
        <button 
          class="qty-btn minus"
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1"
        >
          <i class="fas fa-minus"></i>
        </button>
        <span class="qty-value">{{ item.quantity }}</span>
        <button 
          class="qty-btn plus"
          @click="increaseQuantity"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <!-- Item Total & Remove -->
    <div class="item-actions">
      <div class="item-total">
        ${{ itemTotal }}
      </div>
      <button 
        class="remove-item"
        @click="$emit('remove-item', item.id)"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove-item'])

const itemTotal = computed(() => {
  return props.item.price * props.item.quantity
})

const increaseQuantity = () => {
  emit('update-quantity', props.item.id, props.item.quantity + 1)
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}
</script>

<style scoped>
.cart-item {
  @apply flex items-start space-x-4 p-4 bg-white rounded-lg border;
  border-color: #E9D5FF;
}

.item-image {
  @apply w-16 h-16 flex-shrink-0;
}

.product-image {
  @apply w-full h-full object-cover rounded-lg;
}

.placeholder-image {
  @apply w-full h-full rounded-lg flex items-center justify-center text-2xl;
  background-color: #F5F3FF;
  color: #C4B5FD;
}

.item-info {
  @apply flex-1 min-w-0;
}

.item-name {
  @apply font-semibold text-sm mb-1 truncate;
  color: #6B21A8;
}

.item-price {
  @apply font-medium text-sm mb-3;
  color: #8B5CF6;
}

.quantity-control {
  @apply flex items-center space-x-2;
}

.qty-btn {
  @apply w-8 h-8 bg-white border rounded-md flex items-center justify-center transition-all duration-300;
  border-color: #C4B5FD;
  color: #8B5CF6;
}

.qty-btn:hover:not(:disabled) {
  background-color: #C4B5FD;
  color: white;
}

.qty-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.qty-value {
  @apply font-medium min-w-8 text-center;
  color: #6B21A8;
}

.item-actions {
  @apply flex flex-col items-end space-y-2;
}

.item-total {
  @apply font-bold;
  color: #8B5CF6;
}

.remove-item {
  @apply transition-colors duration-300 p-1;
  color: #F8BBD9;
}

.remove-item:hover {
  color: #EC4899;
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .cart-item {
    @apply space-x-3 p-3;
  }
  
  .item-image {
    @apply w-14 h-14;
  }
  
  .qty-btn {
    @apply w-7 h-7 text-sm;
  }
}
</style>