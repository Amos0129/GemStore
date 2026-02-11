<template>
  <div id="app">
    <!-- 登入頁面 -->
    <LoginView v-if="!userStore.isLoggedIn" />
    
    <!-- 主要管理介面 -->
    <MainLayout v-else />
    
    <!-- 全局載入狀態 -->
    <LoadingOverlay v-if="isLoading" />
    
    <!-- Toast 通知 -->
    <el-notification
      v-if="notification.show"
      :title="notification.title"
      :message="notification.message"
      :type="notification.type"
      :duration="3000"
      @close="hideNotification"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'

import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const isLoading = computed(() => userStore.isLoading)
const notification = computed(() => notificationStore.current)

const hideNotification = () => {
  notificationStore.hide()
}

onMounted(async () => {
  // 移除載入畫面
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0'
      setTimeout(() => {
        loadingScreen.remove()
      }, 300)
    }, 1000)
  }
  
  // 檢查登入狀態
  if (localStorage.getItem('admin_token')) {
    await userStore.checkAuth()
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>