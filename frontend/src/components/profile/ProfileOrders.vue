<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">我的訂單</h2>
      <div class="flex items-center space-x-3">
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          <option value="">所有狀態</option>
          <option value="pending">待付款</option>
          <option value="paid">已付款</option>
          <option value="shipping">配送中</option>
          <option value="delivered">已送達</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>
    </div>

    <div v-if="filteredOrders.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">暫無訂單</h3>
      <p class="text-gray-500 mb-4">您還沒有任何訂單記錄</p>
      <router-link
        to="/products"
        class="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        開始購物
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="border rounded-lg p-4"
      >
        <!-- Order Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b">
          <div class="flex items-center space-x-4">
            <h3 class="font-semibold text-gray-900">訂單 #{{ order.orderNumber }}</h3>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getStatusClass(order.status)
              ]"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            <p class="font-semibold text-gray-900">總計：NT$ {{ order.total.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="space-y-3 mb-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center space-x-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
              <p class="text-sm text-gray-600">數量：{{ item.quantity }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
              <p class="text-sm text-gray-600">單價：NT$ {{ item.price.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-sm text-gray-600">配送至：{{ order.shippingAddress }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-if="order.status === 'pending'"
              @click="payOrder(order)"
              class="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              立即付款
            </button>
            <button
              v-if="order.status === 'delivered'"
              @click="reorderItems(order)"
              class="text-sm border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
            >
              再次購買
            </button>
            <button
              v-if="['pending', 'paid'].includes(order.status)"
              @click="cancelOrder(order)"
              class="text-sm text-red-600 hover:text-red-700 px-4 py-2 transition-colors"
            >
              取消訂單
            </button>
            <button
              @click="viewOrderDetail(order)"
              class="text-sm text-purple-600 hover:text-purple-700 px-4 py-2 transition-colors"
            >
              查看詳情
            </button>
          </div>
        </div>

        <!-- Tracking Info -->
        <div v-if="order.status === 'shipping' && order.trackingNumber" class="mt-4 p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-blue-700">
              物流追蹤號：{{ order.trackingNumber }} 
              <button class="underline hover:no-underline ml-2">追蹤包裹</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="text-center mt-6">
      <button
        @click="loadMoreOrders"
        :disabled="isLoading"
        class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading">載入更多訂單</span>
        <span v-else>載入中...</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'

const router = useRouter()
const cartStore = useCartStore()

const statusFilter = ref('')
const isLoading = ref(false)
const hasMore = ref(false)

const orders = ref([
  {
    id: 1,
    orderNumber: 'ORD20240115001',
    status: 'delivered',
    total: 3580,
    createdAt: new Date('2024-01-15'),
    shippingAddress: '台北市信義區松山路100號',
    trackingNumber: null,
    items: [
      {
        id: 1,
        name: '紫水晶項鍊',
        price: 1580,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 2,
        name: '玫瑰金手鍊',
        price: 2000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD20240110001',
    status: 'shipping',
    total: 4580,
    createdAt: new Date('2024-01-10'),
    shippingAddress: '台北市信義區松山路100號',
    trackingNumber: 'TW1234567890',
    items: [
      {
        id: 3,
        name: '鑽石耳環',
        price: 4580,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD20240105001',
    status: 'pending',
    total: 6800,
    createdAt: new Date('2024-01-05'),
    shippingAddress: '台北市信義區松山路100號',
    trackingNumber: null,
    items: [
      {
        id: 4,
        name: '藍寶石戒指',
        price: 6800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
])

const filteredOrders = computed(() => {
  if (!statusFilter.value) {
    return orders.value
  }
  return orders.value.filter(order => order.status === statusFilter.value)
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待付款',
    paid: '已付款',
    shipping: '配送中',
    delivered: '已送達',
    cancelled: '已取消'
  }
  return texts[status] || '未知狀態'
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const payOrder = (order) => {
  // Redirect to payment page
  router.push(`/payment/${order.id}`)
}

const cancelOrder = (order) => {
  if (confirm('確定要取消此訂單嗎？')) {
    order.status = 'cancelled'
  }
}

const reorderItems = (order) => {
  // Add all items to cart
  order.items.forEach(item => {
    cartStore.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: '重新訂購商品'
    }, item.quantity)
  })
  
  router.push('/cart')
}

const viewOrderDetail = (order) => {
  router.push(`/order/${order.id}`)
}

const loadMoreOrders = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more orders (simulate)
    hasMore.value = false // No more orders to load
  } catch (error) {
    console.error('Load more orders failed:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Check if there are more orders to load
  hasMore.value = orders.value.length >= 10 // Example condition
})
</script>

<style scoped>
/* Additional styles if needed */
</style>