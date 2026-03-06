<template>
  <div class="bg-white rounded-xl shadow-md border-0 p-6" style="box-shadow: 0 4px 15px rgba(96, 165, 250, 0.12);">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style="background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%);">
          <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold" style="color: #1E3A8A;">個人資訊</h2>
      </div>
      <button
        @click="isEditing = !isEditing"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
        :style="isEditing ? 'background-color: #F3F4F6; color: #374151;' : 'background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%); color: white;'"
      >
        {{ isEditing ? '取消編輯' : '編輯資料' }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Avatar -->
      <div class="bg-gray-50 rounded-lg p-4" style="border: 1px solid rgba(96, 165, 250, 0.08);">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style="background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%);">
              <span class="text-xl font-bold" style="color: #60A5FA;">{{ userInitial }}</span>
            </div>
            <button
              v-if="isEditing"
              type="button"
              class="absolute -bottom-1 -right-1 w-6 h-6 text-white rounded-full flex items-center justify-center transition-all shadow-sm"
              style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
          <div>
            <h3 class="text-base font-semibold mb-1" style="color: #1E3A8A;">個人照片</h3>
            <p class="text-xs" style="color: #6B7280;">上傳您的個人照片</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-xs font-medium mb-1.5" style="color: #374151;">姓氏</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block text-xs font-medium mb-1.5" style="color: #374151;">名字</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-xs font-medium mb-1.5" style="color: #374151;">電子郵件</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          />
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-xs font-medium mb-1.5" style="color: #374151;">手機號碼</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          />
        </div>

        <!-- Birthday -->
        <div>
          <label for="birthday" class="block text-xs font-medium mb-1.5" style="color: #374151;">生日</label>
          <input
            id="birthday"
            v-model="form.birthday"
            type="date"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          />
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-xs font-medium mb-1.5" style="color: #374151;">性別</label>
          <select
            id="gender"
            v-model="form.gender"
            :disabled="!isEditing"
            class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
            :style="isEditing ? 'border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;' : 'border-color: rgba(229, 231, 235, 1); background-color: #f9fafb;'"
            onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
            onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
          >
            <option value="">請選擇</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- Member Since -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: #374151;">會員註冊時間</label>
          <div class="w-full px-3 py-2.5 border rounded-lg text-sm" style="border-color: rgba(229, 231, 235, 1); background-color: #f9fafb; color: #6b7280;">
            {{ memberSince }}
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div v-if="isEditing" class="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 border rounded-lg text-sm font-medium transition-all"
          style="border-color: rgba(229, 231, 235, 1); background-color: #ffffff; color: #374151;"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);"
        >
          <span v-if="!isSubmitting">儲存變更</span>
          <span v-else>儲存中...</span>
        </button>
      </div>
    </form>

    <!-- Account Settings -->
    <div v-if="!isEditing" class="mt-6 pt-5" style="border-top: 1px solid rgba(96, 165, 250, 0.12);">
      <div class="flex items-center mb-4">
        <div class="w-6 h-6 rounded-lg flex items-center justify-center mr-2.5" style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h3 class="text-base font-semibold" style="color: #1E3A8A;">快速設定</h3>
      </div>
      <div class="space-y-2">
        <button class="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg transition-all" style="background-color: #f8fafc; border: 1px solid rgba(96, 165, 250, 0.08);" onmouseover="this.style.backgroundColor='rgba(96, 165, 250, 0.04)'" onmouseout="this.style.backgroundColor='#f8fafc'">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 rounded-md flex items-center justify-center" style="background-color: rgba(96, 165, 250, 0.1);">
              <svg class="w-3.5 h-3.5" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <span class="text-sm font-semibold" style="color: #1E3A8A;">變更密碼</span>
              <p class="text-xs" style="color: #6b7280;">更新您的登入密碼</p>
            </div>
          </div>
          <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button class="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg transition-all" style="background-color: #f8fafc; border: 1px solid rgba(96, 165, 250, 0.08);" onmouseover="this.style.backgroundColor='rgba(96, 165, 250, 0.04)'" onmouseout="this.style.backgroundColor='#f8fafc'">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 rounded-md flex items-center justify-center" style="background-color: rgba(96, 165, 250, 0.1);">
              <svg class="w-3.5 h-3.5" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 2C8.69 2 6 4.69 6 8c0 5.25 0 8.14-1.41 9.55A1 1 0 006 19h12a1 1 0 001.41-1.45C18 16.14 18 13.25 18 8c0-3.31-2.69-6-6-6z"></path>
              </svg>
            </div>
            <div>
              <span class="text-sm font-semibold" style="color: #1E3A8A;">通知設定</span>
              <p class="text-xs" style="color: #6b7280;">管理郵件和簡訊通知</p>
            </div>
          </div>
          <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button class="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg transition-all" style="background-color: #f8fafc; border: 1px solid rgba(96, 165, 250, 0.08);" onmouseover="this.style.backgroundColor='rgba(96, 165, 250, 0.04)'" onmouseout="this.style.backgroundColor='#f8fafc'">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 rounded-md flex items-center justify-center" style="background-color: rgba(96, 165, 250, 0.1);">
              <svg class="w-3.5 h-3.5" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <span class="text-sm font-semibold" style="color: #1E3A8A;">隱私設定</span>
              <p class="text-xs" style="color: #6b7280;">控制個人資料可見性</p>
            </div>
          </div>
          <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const isEditing = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: '',
  gender: ''
})

const originalForm = reactive({ ...form })

const userInitial = computed(() => {
  return form.firstName ? form.firstName.charAt(0).toUpperCase() : 'U'
})

const memberSince = computed(() => {
  if (userStore.userInfo?.createdAt) {
    return new Date(userStore.userInfo.createdAt).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }
  return '未知'
})

// 初始化表單資料
const initializeForm = () => {
  const userInfo = userStore.userInfo
  if (userInfo) {
    form.firstName = userInfo.firstName || ''
    form.lastName = userInfo.lastName || ''
    form.email = userInfo.email || ''
    form.phone = userInfo.phone || ''
    form.birthday = userInfo.birthday || ''
    form.gender = userInfo.gender || ''
    
    Object.assign(originalForm, form)
  }
}

onMounted(() => {
  initializeForm()
})

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const result = await userStore.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone
      // Note: email 通常不允許修改
    })
    
    if (result.success) {
      // Update original form with new values
      Object.assign(originalForm, form)
      
      isEditing.value = false
      
      // Show success message
      alert('個人資訊已更新')
    } else {
      alert(result.error || '更新失敗')
    }
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