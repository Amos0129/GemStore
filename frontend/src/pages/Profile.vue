<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <!-- User Info -->
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-xl font-semibold text-purple-600">{{ userInitial }}</span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">{{ user.name }}</h2>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
            </div>

            <!-- Navigation -->
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <component :is="tab.icon" class="mr-3 h-5 w-5" />
                {{ tab.name }}
              </button>
            </nav>

            <!-- Logout -->
            <div class="mt-6 pt-6 border-t">
              <button
                @click="handleLogout"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div v-else-if="activeTab === 'settings'" class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">帳戶設定</h2>
            
            <div class="space-y-6">
              <!-- Password Change -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">變更密碼</h3>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">目前密碼</label>
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">確認新密碼</label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    變更密碼
                  </button>
                </form>
              </div>

              <!-- Notification Settings -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">通知設定</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">電子郵件通知</h4>
                      <p class="text-sm text-gray-600">接收訂單更新和促銷資訊</p>
                    </div>
                    <input
                      v-model="notificationSettings.email"
                      type="checkbox"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">簡訊通知</h4>
                      <p class="text-sm text-gray-600">接收配送和重要通知</p>
                    </div>
                    <input
                      v-model="notificationSettings.sms"
                      type="checkbox"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <!-- Privacy Settings -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">隱私設定</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">個人資料公開</h4>
                      <p class="text-sm text-gray-600">允許其他用戶查看您的個人資料</p>
                    </div>
                    <input
                      v-model="privacySettings.profilePublic"
                      type="checkbox"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">購買記錄分析</h4>
                      <p class="text-sm text-gray-600">允許我們分析您的購買記錄以提供更好的推薦</p>
                    </div>
                    <input
                      v-model="privacySettings.purchaseAnalytics"
                      type="checkbox"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
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

const user = reactive({
  name: '王小美',
  email: 'user@example.com'
})

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
  return user.name ? user.name.charAt(0).toUpperCase() : 'U'
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('密碼變更成功')
    
    // Reset form
    Object.keys(passwordForm).forEach(key => {
      passwordForm[key] = ''
    })
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