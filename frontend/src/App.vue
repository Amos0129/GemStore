<template>
  <div id="app" class="min-h-screen">
    <!-- Navigation -->
    <Navbar v-if="showNavbar" />
    
    <!-- Main Content -->
    <main class="main-content" :class="{ 'with-navbar': showNavbar }">
      <router-view v-slot="{ Component, route }">
        <transition name="route" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <Footer v-if="showFooter" />
    
    <!-- Cart Sidebar -->
    <CartSidebar />
    
    <!-- Toast Notifications -->
    <ToastNotification />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useProductStore } from '@/store/products'

import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CartSidebar from '@/components/cart/CartSidebar.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const route = useRoute()
const userStore = useUserStore()
const productsStore = useProductStore()

// 計算是否顯示導航欄和頁腳
const showNavbar = computed(() => {
  const hideNavbarRoutes = []
  return !hideNavbarRoutes.includes(route.name)
})

const showFooter = computed(() => {
  const hideFooterRoutes = ['Checkout']
  return !hideFooterRoutes.includes(route.name)
})

const isLoading = computed(() => {
  return userStore.isLoading || productsStore.isLoading
})

onMounted(async () => {
  // 初始化用戶資訊
  if (userStore.token) {
    await userStore.fetchUserInfo()
  }
  
  // 初始化產品分類
  await productsStore.fetchCategories()
})
</script>

<style scoped>
.main-content {
  min-height: 100vh;
}

.main-content.with-navbar {
  margin-top: 80px;
}

/* 路由過渡動畫 */
.route-enter-active,
.route-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.route-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>