<template>
  <div class="cart-overlay" :class="{ active: cartStore.isOpen }" @click="cartStore.closeCart">
    <div class="cart-sidebar" :class="{ active: cartStore.isOpen }" @click.stop>
      <!-- Cart Header -->
      <div class="cart-header">
        <h3 class="cart-title">購物車</h3>
        <button class="close-cart" @click="cartStore.closeCart">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Cart Items -->
      <div class="cart-items">
        <!-- Empty State -->
        <div v-if="cartStore.isEmpty" class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>你的購物車是空的</p>
          <router-link to="/products" class="continue-shopping" @click="cartStore.closeCart">
            繼續購物
          </router-link>
        </div>
        
        <!-- Cart Items List -->
        <div v-else class="cart-items-list">
          <CartItem 
            v-for="item in cartStore.items" 
            :key="item.id"
            :item="item"
            @update-quantity="handleUpdateQuantity"
            @remove-item="handleRemoveItem"
          />
        </div>
      </div>
      
      <!-- Cart Footer -->
      <div v-if="!cartStore.isEmpty" class="cart-footer">
        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-row">
            <span>小計</span>
            <span>${{ cartStore.totalPrice }}</span>
          </div>
          <div class="summary-row">
            <span>運費</span>
            <span>{{ shippingCost === 0 ? '免費' : '$' + shippingCost }}</span>
          </div>
          <div class="summary-row total">
            <span>總計</span>
            <span>${{ totalWithShipping }}</span>
          </div>
        </div>
        
        <!-- Cart Actions -->
        <div class="cart-actions">
          <router-link 
            to="/cart" 
            class="view-cart-btn"
            @click="cartStore.closeCart"
          >
            查看購物車
          </router-link>
          <router-link 
            to="/checkout" 
            class="checkout-btn"
            @click="cartStore.closeCart"
          >
            立即結帳
          </router-link>
        </div>
        
        <!-- Free Shipping Notice -->
        <div v-if="freeShippingThreshold && cartStore.totalPrice < freeShippingThreshold" class="shipping-notice">
          <i class="fas fa-truck"></i>
          再消費 ${{ freeShippingThreshold - cartStore.totalPrice }} 即享免費運送
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/composables/useToast'

import CartItem from './CartItem.vue'

const cartStore = useCartStore()
const { showToast } = useToast()

// 運費設定
const freeShippingThreshold = 1000
const standardShippingCost = 80

const shippingCost = computed(() => {
  if (cartStore.totalPrice >= freeShippingThreshold) {
    return 0
  }
  return cartStore.isEmpty ? 0 : standardShippingCost
})

const totalWithShipping = computed(() => {
  return cartStore.totalPrice + shippingCost.value
})

const handleUpdateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const handleRemoveItem = (productId) => {
  const item = cartStore.items.find(item => item.id === productId)
  cartStore.removeItem(productId)
  showToast(`${item.name} 已從購物車移除`, 'info')
}
</script>

<style scoped>
.cart-overlay {
  @apply fixed inset-0 bg-black/50 z-50 opacity-0 invisible transition-all duration-300;
}

.cart-overlay.active {
  @apply opacity-100 visible;
}

.cart-sidebar {
  @apply fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-purple-200 flex flex-col transform translate-x-full transition-transform duration-300;
  box-shadow: -4px 0 20px rgba(139, 92, 246, 0.1);
}

.cart-sidebar.active {
  @apply translate-x-0;
}

.cart-header {
  @apply flex items-center justify-between p-6 border-b border-purple-200;
  background-color: #F8F7FF;
}

.cart-title {
  @apply text-xl font-bold;
  color: #8B5CF6;
}

.close-cart {
  @apply bg-none border-none text-xl cursor-pointer p-2 transition-colors duration-300;
  color: #6B21A8;
}

.close-cart:hover {
  color: #F8BBD9;
}

.cart-items {
  @apply flex-1 overflow-y-auto p-6;
}

.empty-cart {
  @apply text-center py-16;
}

.empty-cart i {
  @apply text-6xl mb-4;
  color: #C4B5FD;
}

.empty-cart p {
  @apply text-lg mb-6;
  color: #6B21A8;
}

.continue-shopping {
  @apply px-6 py-3 rounded-lg font-semibold transition-colors inline-block;
  background-color: #C4B5FD;
  color: #581C87;
}

.continue-shopping:hover {
  background-color: #8B5CF6;
  color: white;
}

.cart-items-list {
  @apply space-y-4;
}

.cart-footer {
  @apply border-t border-purple-200 p-6 space-y-4;
  background-color: #FEFEFF;
}

.cart-summary {
  @apply space-y-3;
}

.summary-row {
  @apply flex justify-between;
  color: #6B21A8;
}

.summary-row.total {
  @apply text-lg font-bold border-t border-purple-200 pt-3;
  color: #8B5CF6;
}

.cart-actions {
  @apply space-y-3;
}

.view-cart-btn {
  @apply block w-full px-6 py-3 rounded-lg font-semibold transition-colors text-center;
  border: 1px solid #C4B5FD;
  color: #8B5CF6;
  background-color: transparent;
}

.view-cart-btn:hover {
  background-color: rgba(196, 181, 253, 0.1);
  color: #6B21A8;
}

.checkout-btn {
  @apply block w-full px-6 py-3 rounded-lg font-semibold transition-colors text-center;
  background-color: #C4B5FD;
  color: #581C87;
}

.checkout-btn:hover {
  background-color: #8B5CF6;
  color: white;
}

.shipping-notice {
  @apply flex items-center space-x-2 text-sm p-3 rounded-lg;
  color: #6B21A8;
  background-color: rgba(196, 181, 253, 0.15);
}

.shipping-notice i {
  color: #C4B5FD;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .cart-sidebar {
    @apply max-w-full;
  }
}
</style>