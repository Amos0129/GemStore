<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <div class="mb-4">
        <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13h10m-10 0l-1.5-6.5m0 0L4.4 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h8" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">購物車是空的</h2>
      <p class="text-gray-500 mb-6">快去選購您喜歡的商品吧！</p>
      <router-link
        to="/products"
        class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
      >
        開始購物
      </router-link>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">購物車</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border p-6"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                <p class="text-gray-500">{{ item.description }}</p>
                <p class="text-lg font-bold text-purple-600 mt-1">NT$ {{ item.price.toLocaleString() }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <span class="text-gray-600">-</span>
                </button>
                <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <span class="text-gray-600">+</span>
                </button>
              </div>
              <button
                @click="cartStore.removeItem(item.id)"
                class="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">訂單摘要</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">商品小計</span>
                <span class="text-gray-900">NT$ {{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">運費</span>
                <span class="text-gray-900">NT$ {{ shippingFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">優惠折扣</span>
                <span class="text-green-600">-NT$ {{ discount.toLocaleString() }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span>總計</span>
                  <span class="text-purple-600">NT$ {{ total.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <input
                v-model="couponCode"
                type="text"
                placeholder="優惠券代碼"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                @click="applyCoupon"
                class="w-full text-sm text-purple-600 border border-purple-600 py-2 rounded-md hover:bg-purple-50 transition-colors"
              >
                套用優惠券
              </button>
              <router-link
                to="/checkout"
                class="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors text-center block font-semibold"
              >
                前往結帳
              </router-link>
              <router-link
                to="/products"
                class="w-full text-center text-purple-600 py-2 block hover:text-purple-700 transition-colors"
              >
                繼續購物
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const couponCode = ref('')

const shippingFee = ref(100)
const discount = ref(0)

const total = computed(() => {
  return cartStore.subtotal + shippingFee.value - discount.value
})

const applyCoupon = () => {
  // Implement coupon logic
  if (couponCode.value === 'WELCOME10') {
    discount.value = cartStore.subtotal * 0.1
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>