<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">收件地址</h2>
      <button
        @click="showAddForm = true"
        class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
      >
        新增地址
      </button>
    </div>

    <!-- Address List -->
    <div v-if="addresses.length > 0" class="space-y-4 mb-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="border rounded-lg p-4 relative"
        :class="{ 'border-purple-500 bg-purple-50': address.isDefault }"
      >
        <!-- Default Badge -->
        <div v-if="address.isDefault" class="absolute top-3 right-3">
          <span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            預設地址
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <h3 class="font-medium text-gray-900">{{ address.name }}</h3>
            <span class="text-sm text-gray-600">{{ address.phone }}</span>
          </div>
          
          <p class="text-gray-700">
            {{ address.city }}{{ address.district }}{{ address.address }}
          </p>
          
          <p class="text-sm text-gray-600">
            郵遞區號：{{ address.zipCode }}
          </p>

          <div class="flex items-center space-x-4 pt-2">
            <button
              @click="editAddress(address)"
              class="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              編輯
            </button>
            <button
              v-if="!address.isDefault"
              @click="setDefaultAddress(address.id)"
              class="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              設為預設
            </button>
            <button
              v-if="addresses.length > 1"
              @click="deleteAddress(address.id)"
              class="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">暫無收件地址</h3>
      <p class="text-gray-500 mb-4">新增您的收件地址以便配送</p>
    </div>

    <!-- Add/Edit Address Form -->
    <div
      v-if="showAddForm || editingAddress"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeForm"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingAddress ? '編輯地址' : '新增地址' }}
          </h3>
          <button
            @click="closeForm"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">收件人姓名</label>
              <input
                id="name"
                v-model="addressForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="請輸入收件人姓名"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
              <input
                id="phone"
                v-model="addressForm.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="請輸入手機號碼"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">縣市</label>
              <select
                id="city"
                v-model="addressForm.city"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">請選擇縣市</option>
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="桃園市">桃園市</option>
                <option value="台中市">台中市</option>
                <option value="台南市">台南市</option>
                <option value="高雄市">高雄市</option>
              </select>
            </div>
            <div>
              <label for="district" class="block text-sm font-medium text-gray-700 mb-1">區域</label>
              <input
                id="district"
                v-model="addressForm.district"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="請輸入區域"
              />
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">詳細地址</label>
            <input
              id="address"
              v-model="addressForm.address"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="請輸入詳細地址"
            />
          </div>

          <div>
            <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-1">郵遞區號</label>
            <input
              id="zipCode"
              v-model="addressForm.zipCode"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="請輸入郵遞區號"
            />
          </div>

          <div class="flex items-center">
            <input
              id="isDefault"
              v-model="addressForm.isDefault"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label for="isDefault" class="ml-2 block text-sm text-gray-900">
              設為預設地址
            </label>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeForm"
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting">{{ editingAddress ? '儲存' : '新增' }}</span>
              <span v-else>處理中...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const showAddForm = ref(false)
const editingAddress = ref(null)
const isSubmitting = ref(false)

const addresses = ref([
  {
    id: 1,
    name: '王小美',
    phone: '0912345678',
    city: '台北市',
    district: '信義區',
    address: '松山路100號',
    zipCode: '110',
    isDefault: true
  },
  {
    id: 2,
    name: '王小美',
    phone: '0912345678',
    city: '台北市',
    district: '大安區',
    address: '復興南路200號',
    zipCode: '106',
    isDefault: false
  }
])

const addressForm = reactive({
  name: '',
  phone: '',
  city: '',
  district: '',
  address: '',
  zipCode: '',
  isDefault: false
})

const resetForm = () => {
  Object.keys(addressForm).forEach(key => {
    if (key === 'isDefault') {
      addressForm[key] = false
    } else {
      addressForm[key] = ''
    }
  })
}

const editAddress = (address) => {
  editingAddress.value = address
  Object.keys(addressForm).forEach(key => {
    addressForm[key] = address[key]
  })
}

const closeForm = () => {
  showAddForm.value = false
  editingAddress.value = null
  resetForm()
}

const saveAddress = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingAddress.value) {
      // Update existing address
      const index = addresses.value.findIndex(addr => addr.id === editingAddress.value.id)
      if (index !== -1) {
        addresses.value[index] = { ...addressForm, id: editingAddress.value.id }
      }
    } else {
      // Add new address
      const newAddress = {
        ...addressForm,
        id: Date.now() // Generate simple ID
      }
      addresses.value.push(newAddress)
    }
    
    // If set as default, remove default from others
    if (addressForm.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== (editingAddress.value?.id || Date.now())) {
          addr.isDefault = false
        }
      })
    }
    
    closeForm()
  } catch (error) {
    console.error('Save address failed:', error)
    alert('儲存失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

const setDefaultAddress = async (addressId) => {
  try {
    addresses.value.forEach(addr => {
      addr.isDefault = addr.id === addressId
    })
  } catch (error) {
    console.error('Set default address failed:', error)
  }
}

const deleteAddress = async (addressId) => {
  if (!confirm('確定要刪除此地址嗎？')) return
  
  try {
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index !== -1) {
      addresses.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Delete address failed:', error)
    alert('刪除失敗，請稍後再試')
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>