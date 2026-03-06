<template>
  <div class="min-h-screen" style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-md border-0 p-5 sticky top-6" style="box-shadow: 0 4px 15px rgba(96, 165, 250, 0.12);">
            <!-- User Info -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md" style="background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%);">
                  <span class="text-xl font-bold" style="color: #60A5FA;">{{ userInitial }}</span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" style="background-color: #22C55E;"></div>
              </div>
              <h2 class="text-lg font-bold mb-1" style="color: #1E3A8A;">{{ user.firstName }} {{ user.lastName }}</h2>
              <p class="text-xs" style="color: #6B7280;">{{ user.email }}</p>
            </div>

            <!-- Navigation -->
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                  activeTab === tab.id
                    ? 'text-white shadow-md'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                ]"
                :style="activeTab === tab.id ? { background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', color: 'white' } : { color: '#6B7280' }"
              >
                <component :is="tab.icon" class="mr-2.5 h-4 w-4" />
                {{ tab.name }}
              </button>
            </nav>

            <!-- Logout -->
            <div class="mt-6 pt-4" style="border-top: 1px solid #F3F4F6;">
              <button
                @click="handleLogout"
                class="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
              >
                <svg class="mr-2.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                登出
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Profile Info Tab -->
          <ProfileInfo v-if="activeTab === 'info'" />
          
          <!-- Orders Tab -->
          <ProfileOrders v-else-if="activeTab === 'orders'" />
          
          <!-- Wishlist Tab -->
          <ProfileWishlist v-else-if="activeTab === 'wishlist'" />
          
          <!-- Address Tab -->
          <ProfileAddress v-else-if="activeTab === 'address'" />
          
          <!-- Account Settings Tab -->
          <div v-else-if="activeTab === 'settings'" class="bg-white rounded-xl shadow-md border-0 p-6" style="box-shadow: 0 4px 15px rgba(96, 165, 250, 0.12);">
            <div class="flex items-center mb-6">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style="background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%);">
                <svg class="w-4 h-4" style="color: #60A5FA;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold" style="color: #1E3A8A;">帳戶設定</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Password Change -->
              <div class="bg-gray-50 rounded-lg p-5" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                <div class="flex items-center mb-5">
                  <div class="w-6 h-6 rounded-md flex items-center justify-center mr-2.5" style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold" style="color: #1E3A8A;">變更密碼</h3>
                </div>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-xs font-medium mb-1.5" style="color: #374151;">目前密碼</label>
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
                      style="border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;"
                      onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
                      onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
                    />
                  </div>
                  <div>
                    <label for="newPassword" class="block text-xs font-medium mb-1.5" style="color: #374151;">新密碼</label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
                      style="border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;"
                      onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
                      onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
                    />
                  </div>
                  <div>
                    <label for="confirmPassword" class="block text-xs font-medium mb-1.5" style="color: #374151;">確認新密碼</label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2.5 border rounded-lg transition-all focus:outline-none text-sm"
                      style="border-color: rgba(96, 165, 250, 0.3); background-color: #ffffff;"
                      onfocus="this.style.borderColor='#60A5FA'; this.style.boxShadow='0 0 0 2px rgba(96, 165, 250, 0.08)'"
                      onblur="this.style.borderColor='rgba(96, 165, 250, 0.3)'; this.style.boxShadow='none'"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-all"
                    style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);"
                  >
                    變更密碼
                  </button>
                </form>
              </div>

              <!-- Notification Settings -->
              <div class="bg-gray-50 rounded-lg p-5" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                <div class="flex items-center mb-5">
                  <div class="w-6 h-6 rounded-md flex items-center justify-center mr-2.5" style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 2C8.69 2 6 4.69 6 8c0 5.25 0 8.14-1.41 9.55A1 1 0 006 19h12a1 1 0 001.41-1.45C18 16.14 18 13.25 18 8c0-3.31-2.69-6-6-6z"></path>
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold" style="color: #1E3A8A;">通知設定</h3>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between bg-white rounded-lg p-3" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                    <div>
                      <h4 class="text-sm font-semibold mb-1" style="color: #1E3A8A;">電子郵件通知</h4>
                      <p class="text-xs" style="color: #6B7280;">接收訂單更新和促銷資訊</p>
                    </div>
                    <div class="relative inline-block w-10 h-5">
                      <input
                        v-model="notificationSettings.email"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-10 h-5 rounded-full transition-colors peer-checked:bg-blue-500" style="background-color: #E5E7EB; cursor: pointer;"
                           @click="notificationSettings.email = !notificationSettings.email">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" 
                             :style="notificationSettings.email ? 'transform: translateX(20px); background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);' : 'transform: translateX(2px);'"
                             style="margin: 4px;"></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between bg-white rounded-lg p-3" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                    <div>
                      <h4 class="text-sm font-semibold mb-1" style="color: #1E3A8A;">簡訊通知</h4>
                      <p class="text-xs" style="color: #6B7280;">接收配送和重要通知</p>
                    </div>
                    <div class="relative inline-block w-10 h-5">
                      <input
                        v-model="notificationSettings.sms"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-10 h-5 rounded-full transition-colors peer-checked:bg-blue-500" style="background-color: #E5E7EB; cursor: pointer;"
                           @click="notificationSettings.sms = !notificationSettings.sms">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" 
                             :style="notificationSettings.sms ? 'transform: translateX(20px); background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);' : 'transform: translateX(2px);'"
                             style="margin: 4px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Privacy Settings -->
              <div class="bg-gray-50 rounded-lg p-5" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                <div class="flex items-center mb-5">
                  <div class="w-6 h-6 rounded-md flex items-center justify-center mr-2.5" style="background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold" style="color: #1E3A8A;">隱私設定</h3>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between bg-white rounded-lg p-3" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                    <div>
                      <h4 class="text-sm font-semibold mb-1" style="color: #1E3A8A;">個人資料公開</h4>
                      <p class="text-xs" style="color: #6B7280;">允許其他用戶查看您的個人資料</p>
                    </div>
                    <div class="relative inline-block w-10 h-5">
                      <input
                        v-model="privacySettings.profilePublic"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-10 h-5 rounded-full transition-colors peer-checked:bg-blue-500" style="background-color: #E5E7EB; cursor: pointer;"
                           @click="privacySettings.profilePublic = !privacySettings.profilePublic">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" 
                             :style="privacySettings.profilePublic ? 'transform: translateX(20px); background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);' : 'transform: translateX(2px);'"
                             style="margin: 4px;"></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between bg-white rounded-lg p-3" style="border: 1px solid rgba(96, 165, 250, 0.08);">
                    <div>
                      <h4 class="text-sm font-semibold mb-1" style="color: #1E3A8A;">購買記錄分析</h4>
                      <p class="text-xs" style="color: #6B7280;">允許我們分析您的購買記錄以提供更好的推薦</p>
                    </div>
                    <div class="relative inline-block w-10 h-5">
                      <input
                        v-model="privacySettings.purchaseAnalytics"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-10 h-5 rounded-full transition-colors peer-checked:bg-blue-500" style="background-color: #E5E7EB; cursor: pointer;"
                           @click="privacySettings.purchaseAnalytics = !privacySettings.purchaseAnalytics">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" 
                             :style="privacySettings.purchaseAnalytics ? 'transform: translateX(20px); background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);' : 'transform: translateX(2px);'"
                             style="margin: 4px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ProfileOrders from '@/components/profile/ProfileOrders.vue'
import ProfileWishlist from '@/components/profile/ProfileWishlist.vue'
import ProfileAddress from '@/components/profile/ProfileAddress.vue'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('info')

const user = computed(() => userStore.userInfo)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = reactive({
  email: true,
  sms: true
})

const privacySettings = reactive({
  profilePublic: false,
  purchaseAnalytics: true
})

const userInitial = computed(() => {
  return user.value?.firstName ? user.value.firstName.charAt(0).toUpperCase() : 'U'
})

const tabs = [
  {
    id: 'info',
    name: '個人資訊',
    icon: 'UserIcon'
  },
  {
    id: 'orders',
    name: '我的訂單',
    icon: 'ShoppingBagIcon'
  },
  {
    id: 'wishlist',
    name: '我的收藏',
    icon: 'HeartIcon'
  },
  {
    id: 'address',
    name: '收件地址',
    icon: 'LocationMarkerIcon'
  },
  {
    id: 'settings',
    name: '帳戶設定',
    icon: 'CogIcon'
  }
]

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('新密碼確認不一致')
    return
  }
  
  try {
    const result = await userStore.changePassword({
      currentPassword: passwordForm.currentPassword,
      password: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    })
    
    if (result.success) {
      alert('密碼變更成功')
      
      // Reset form
      Object.keys(passwordForm).forEach(key => {
        passwordForm[key] = ''
      })
    } else {
      alert(result.error || '密碼變更失敗')
    }
  } catch (error) {
    console.error('Change password failed:', error)
    alert('密碼變更失敗，請稍後再試')
  }
}

const handleLogout = async () => {
  if (confirm('確定要登出嗎？')) {
    try {
      await userStore.logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
}

// Icon components (simplified SVG icons)
const UserIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  `
}

const ShoppingBagIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"></path>
    </svg>
  `
}

const HeartIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
    </svg>
  `
}

const LocationMarkerIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `
}

const CogIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `
}

// Register icon components
const components = {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  LocationMarkerIcon,
  CogIcon
}
</script>

<style scoped>
/* Additional styles if needed */
</style>