<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">結帳</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div class="space-y-6">
          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">聯絡資訊</h2>
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="請輸入電子郵件"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="請輸入手機號碼"
                />
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">收件地址</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">姓氏</label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">名字</label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <input
                  id="address"
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="請輸入完整地址"
                />
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">城市</label>
                  <input
                    id="city"
                    v-model="form.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">縣市</label>
                  <select
                    id="state"
                    v-model="form.state"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">選擇縣市</option>
                    <option value="台北市">台北市</option>
                    <option value="新北市">新北市</option>
                    <option value="桃園市">桃園市</option>
                    <option value="台中市">台中市</option>
                    <option value="台南市">台南市</option>
                    <option value="高雄市">高雄市</option>
                  </select>
                </div>
                <div>
                  <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-1">郵遞區號</label>
                  <input
                    id="zipCode"
                    v-model="form.zipCode"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">付款方式</h2>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="credit-card"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span class="ml-3 text-sm font-medium text-gray-900">信用卡</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="bank-transfer"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span class="ml-3 text-sm font-medium text-gray-900">銀行轉帳</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="cod"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span class="ml-3 text-sm font-medium text-gray-900">貨到付款</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">訂單摘要</h2>
            
            <!-- Order Items -->
            <div class="space-y-3 mb-6">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex items-center space-x-3"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-xs text-gray-500">數量：{{ item.quantity }}</p>
                </div>
                <span class="text-sm font-medium text-gray-900">
                  NT$ {{ (item.price * item.quantity).toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-3 border-t pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">商品小計</span>
                <span class="text-gray-900">NT$ {{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">運費</span>
                <span class="text-gray-900">NT$ {{ shippingFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">稅額</span>
                <span class="text-gray-900">NT$ {{ tax.toLocaleString() }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span>總計</span>
                  <span class="text-purple-600">NT$ {{ total.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              @click="handlePlaceOrder"
              :disabled="isSubmitting"
              class="w-full mt-6 bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting">確認訂購</span>
              <span v-else>處理中...</span>
            </button>

            <p class="text-xs text-gray-500 mt-3 text-center">
              點擊「確認訂購」即表示您同意我們的服務條款和隱私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'

const router = useRouter()
const cartStore = useCartStore()

const isSubmitting = ref(false)
const shippingFee = ref(100)
const tax = computed(() => Math.round(cartStore.subtotal * 0.05))

const total = computed(() => {
  return cartStore.subtotal + shippingFee.value + tax.value
})

const form = reactive({
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  paymentMethod: 'credit-card'
})

const handlePlaceOrder = async () => {
  if (isSubmitting.value) return
  
  // Validate form
  const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode']
  const missingFields = requiredFields.filter(field => !form[field])
  
  if (missingFields.length > 0) {
    alert('請填寫所有必填欄位')
    return
  }
  
  if (!form.paymentMethod) {
    alert('請選擇付款方式')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart
    cartStore.clearCart()
    
    // Redirect to success page
    router.push('/order-success')
  } catch (error) {
    console.error('Order failed:', error)
    alert('訂單處理失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>