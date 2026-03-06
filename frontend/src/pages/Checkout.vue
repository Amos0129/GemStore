<template>
  <div class="min-h-screen" style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold mb-2" style="color: #1E3A8A;">結帳</h1>
          <p class="text-sm text-gray-600">安全、快速完成您的購買</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Checkout Form -->
        <div class="bg-white rounded-xl shadow-md border-0 p-6" style="box-shadow: 0 4px 15px rgba(96, 165, 250, 0.08);">
          <div class="space-y-6">
            <!-- Contact Information -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgba(96, 165, 250, 0.1);">
                  <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold" style="color: #1E3A8A;">聯絡資訊</h2>
              </div>
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
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
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
                  placeholder="請輸入手機號碼"
                />
              </div>
            </div>
            </div>

            <!-- Shipping Address -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgba(96, 165, 250, 0.1);">
                  <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold" style="color: #1E3A8A;">收件地址</h2>
              </div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">姓氏</label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">名字</label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
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
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
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
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">縣市</label>
                  <select
                    id="state"
                    v-model="form.state"
                    required
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
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
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-300 transition-colors bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
              </div>
            </div>
            </div>

            <!-- Shipping Method -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgba(96, 165, 250, 0.1);">
                  <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold" style="color: #1E3A8A;">配送方式</h2>
              </div>
            <div class="space-y-3">
              <label 
                v-for="method in settingsStore.availableShippingMethods" 
                :key="method.value"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                :class="{ 'border-blue-300 bg-blue-50': selectedShippingMethod === method.value }"
              >
                <div class="flex items-center">
                  <input
                    v-model="selectedShippingMethod"
                    type="radio"
                    :value="method.value"
                    class="h-4 w-4 text-purple-600 focus:ring-blue-300 border-gray-300"
                  />
                  <div class="ml-3">
                    <span class="text-sm font-medium text-gray-900">{{ method.label }}</span>
                    <p class="text-xs text-gray-500">{{ method.description }}</p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-gray-900">
                  {{ method.fee === 0 ? '免費' : `NT$ ${method.fee}` }}
                </span>
              </label>
            </div>
            </div>

            <!-- Payment Method -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgba(96, 165, 250, 0.1);">
                  <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold" style="color: #1E3A8A;">付款方式</h2>
              </div>
            <div class="space-y-3">
              <label 
                v-for="method in settingsStore.availablePaymentMethods" 
                :key="method.value"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                :class="{ 'border-blue-300 bg-blue-50': form.paymentMethod === method.value }"
              >
                <div class="flex items-center">
                  <input
                    v-model="form.paymentMethod"
                    type="radio"
                    :value="method.value"
                    class="h-4 w-4 text-purple-600 focus:ring-blue-300 border-gray-300"
                  />
                  <span class="ml-3 text-sm font-medium text-gray-900">{{ method.label }}</span>
                </div>
                <span v-if="method.fee > 0" class="text-xs text-gray-500">
                  手續費 {{ method.fee }}%
                </span>
              </label>
            </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-xl shadow-md border-0 p-6 sticky top-6" style="box-shadow: 0 4px 15px rgba(96, 165, 250, 0.08);">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgba(96, 165, 250, 0.1);">
                <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold" style="color: #1E3A8A;">訂單摘要</h2>
            </div>
            
            <!-- Order Items -->
            <div class="space-y-2 mb-4">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex items-center space-x-3"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-10 h-10 object-cover rounded-md"
                />
                <div class="flex-1">
                  <h3 class="text-xs font-medium text-gray-900 leading-tight">{{ item.name }}</h3>
                  <p class="text-xs text-gray-500">數量：{{ item.quantity }}</p>
                </div>
                <span class="text-xs font-medium text-gray-900">
                  NT$ {{ (item.price * item.quantity).toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 border-t pt-3">
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">商品小計</span>
                <span class="text-gray-900">NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">運費</span>
                <span class="text-gray-900">
                  {{ shippingFee === 0 ? '免費' : `NT$ ${shippingFee.toLocaleString()}` }}
                </span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">稅額</span>
                <span class="text-gray-900">NT$ {{ (tax || 0).toLocaleString() }}</span>
              </div>
              <div v-if="paymentFee > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">手續費</span>
                <span class="text-gray-900">NT$ {{ paymentFee.toLocaleString() }}</span>
              </div>
              <div class="border-t pt-2">
                <div class="flex justify-between text-sm font-semibold">
                  <span>總計</span>
                  <span style="color: #60A5FA;">NT$ {{ (total || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              @click="handlePlaceOrder"
              :disabled="isSubmitting"
              class="w-full mt-4 text-white py-3 rounded-lg transition-all font-semibold text-sm transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);"
            >
              <span v-if="!isSubmitting">確認訂購</span>
              <span v-else>處理中...</span>
            </button>

            <p class="text-xs text-gray-500 mt-2 text-center leading-tight">
              點擊「確認訂購」即表示您同意我們的服務條款和隱私政策
            </p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useSettingsStore } from '@/store/settings'

const router = useRouter()
const cartStore = useCartStore()
const settingsStore = useSettingsStore()

const isSubmitting = ref(false)
const selectedShippingMethod = ref('home_delivery')
const shippingFee = computed(() => {
  return settingsStore.calculateShippingFee(selectedShippingMethod.value, cartStore.totalPrice)
})
const tax = computed(() => {
  const taxRate = settingsStore.settings.storeSettings?.taxRate || 5
  return Math.round(cartStore.totalPrice * (taxRate / 100))
})

const paymentFee = computed(() => {
  return settingsStore.calculatePaymentFee(form.paymentMethod, cartStore.totalPrice)
})

const total = computed(() => {
  return cartStore.totalPrice + shippingFee.value + tax.value + paymentFee.value
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
  paymentMethod: '',
  shippingMethod: 'home_delivery'
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
  
  if (!selectedShippingMethod.value) {
    alert('請選擇配送方式')
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

onMounted(async () => {
  await settingsStore.fetchSettings()
  
  // 設定預設付款方式
  if (settingsStore.availablePaymentMethods.length > 0) {
    form.paymentMethod = settingsStore.availablePaymentMethods[0].value
  }
  
  // 設定預設配送方式
  if (settingsStore.availableShippingMethods.length > 0) {
    selectedShippingMethod.value = settingsStore.availableShippingMethods[0].value
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>