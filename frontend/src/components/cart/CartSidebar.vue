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

const handleUpdateQuantity = async (productId, quantity) => {
  try {
    await cartStore.updateQuantity(productId, quantity)
  } catch (error) {
    showToast('更新數量失敗', 'error')
  }
}

const handleRemoveItem = async (productId) => {
  try {
    const item = cartStore.items.find(item => item.id === productId)
    await cartStore.removeItem(productId)
    showToast(`${item.name} 已從購物車移除`, 'info')
  } catch (error) {
    showToast('移除商品失敗', 'error')
  }
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
  @apply fixed right-0 top-0 h-full w-full max-w-md bg-white border-l flex flex-col transform translate-x-full transition-transform duration-300;
  border-left-color: rgba(173, 216, 230, 0.3);
  box-shadow: -4px 0 20px rgba(173, 216, 230, 0.1);
}

.cart-sidebar.active {
  @apply translate-x-0;
}

.cart-header {
  @apply flex items-center justify-between p-6 border-b;
  border-bottom-color: rgba(173, 216, 230, 0.3);
  background-color: #F0F8FF;
}

.cart-title {
  @apply text-xl font-bold;
  color: #2E86AB;
}

.close-cart {
  @apply bg-none border-none text-xl cursor-pointer p-2 transition-colors duration-300;
  color: #2E86AB;
}

.close-cart:hover {
  color: #1B4F72;
}

.cart-items {
  @apply flex-1 overflow-y-auto p-6;
}

.empty-cart {
  @apply text-center py-16;
}

.empty-cart i {
  @apply text-6xl mb-4;
  color: #2E86AB;
}

.empty-cart p {
  @apply text-lg mb-6;
  color: #2E86AB;
}

.continue-shopping {
  @apply px-6 py-3 rounded-lg font-semibold transition-colors inline-block;
  background-color: #1B4F72;
  color: white;
}

.continue-shopping:hover {
  background-color: #2E86AB;
  color: white;
}

.cart-items-list {
  @apply space-y-4;
}

.cart-footer {
  @apply border-t p-6 space-y-4;
  border-top-color: rgba(173, 216, 230, 0.3);
  background-color: #F0F8FF;
}

.cart-summary {
  @apply space-y-3;
}

.summary-row {
  @apply flex justify-between;
  color: #2E86AB;
}

.summary-row.total {
  @apply text-lg font-bold border-t pt-3;
  border-top-color: rgba(173, 216, 230, 0.3);
  color: #1B4F72;
}

.cart-actions {
  @apply space-y-3;
}

.view-cart-btn {
  @apply block w-full px-6 py-3 rounded-lg font-semibold transition-colors text-center;
  border: 1px solid #ADD8E6;
  color: #2E86AB;
  background-color: transparent;
}

.view-cart-btn:hover {
  background-color: rgba(173, 216, 230, 0.1);
  color: #1B4F72;
}

.checkout-btn {
  @apply block w-full px-6 py-3 rounded-lg font-semibold transition-colors text-center;
  background-color: #1B4F72;
  color: white;
}

.checkout-btn:hover {
  background-color: #2E86AB;
  color: white;
}

.shipping-notice {
  @apply flex items-center space-x-2 text-sm p-3 rounded-lg;
  color: #2E86AB;
  background-color: rgba(173, 216, 230, 0.15);
}

.shipping-notice i {
  color: #2E86AB;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .cart-sidebar {
    @apply max-w-full;
  }
}
</style>