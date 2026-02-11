<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">個人資訊</h2>
      <button
        @click="isEditing = !isEditing"
        class="text-purple-600 hover:text-purple-700 font-medium"
      >
        {{ isEditing ? '取消編輯' : '編輯資料' }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Avatar -->
      <div class="flex items-center space-x-6">
        <div class="relative">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-2xl font-semibold text-purple-600">{{ userInitial }}</span>
          </div>
          <button
            v-if="isEditing"
            type="button"
            class="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">個人照片</h3>
          <p class="text-sm text-gray-600">上傳您的個人照片</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            ]"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            ]"
          />
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            ]"
          />
        </div>

        <!-- Birthday -->
        <div>
          <label for="birthday" class="block text-sm font-medium text-gray-700 mb-1">生日</label>
          <input
            id="birthday"
            v-model="form.birthday"
            type="date"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            ]"
          />
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">性別</label>
          <select
            id="gender"
            v-model="form.gender"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            ]"
          >
            <option value="">請選擇</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- Member Since -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">會員註冊時間</label>
          <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-600">
            {{ memberSince }}
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div v-if="isEditing" class="flex justify-end space-x-3">
        <button
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isSubmitting">儲存變更</span>
          <span v-else>儲存中...</span>
        </button>
      </div>
    </form>

    <!-- Account Settings -->
    <div v-if="!isEditing" class="mt-8 pt-6 border-t">
      <h3 class="text-lg font-medium text-gray-900 mb-4">帳戶設定</h3>
      <div class="space-y-3">
        <button class="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
            </svg>
            <span class="text-gray-700">變更密碼</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button class="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-gray-700">通知設定</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button class="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-gray-700">隱私設定</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const isEditing = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  name: '王小美',
  email: 'user@example.com',
  phone: '0912345678',
  birthday: '1990-01-01',
  gender: 'female'
})

const originalForm = reactive({ ...form })

const userInitial = computed(() => {
  return form.name ? form.name.charAt(0).toUpperCase() : 'U'
})

const memberSince = computed(() => {
  return '2024年1月15日'
})

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update original form with new values
    Object.assign(originalForm, form)
    
    isEditing.value = false
    
    // Show success message
    alert('個人資訊已更新')
  } catch (error) {
    console.error('Update failed:', error)
    alert('更新失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

const cancelEdit = () => {
  // Restore original values
  Object.assign(form, originalForm)
  isEditing.value = false
}
</script>

<style scoped>
/* Additional styles if needed */
</style>