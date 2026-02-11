<template>
  <el-container class="admin-layout">
    <!-- 側邊欄 -->
    <el-aside 
      :width="sidebarCollapsed ? '60px' : '260px'" 
      class="sidebar"
      :class="{ 'mobile-show': mobileSidebarVisible }"
    >
      <!-- 側邊欄頭部 -->
      <div class="sidebar-header">
        <div v-if="!sidebarCollapsed" class="logo-section">
          <div class="sidebar-logo">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="sidebar-title">NEXUS ADMIN</div>
        </div>
        <div v-else class="logo-section collapsed">
          <div class="sidebar-logo">
            <i class="fas fa-bolt"></i>
          </div>
        </div>
      </div>
      
      <!-- 側邊欄菜單 -->
      <el-menu
        :default-active="currentRoute"
        class="sidebar-menu"
        :collapse="sidebarCollapsed"
        router
        background-color="transparent"
        text-color="#b0b0b0"
        active-text-color="#00d4ff"
      >
        <el-menu-item index="/" class="menu-item">
          <el-icon><TrendCharts /></el-icon>
          <span>儀表板</span>
        </el-menu-item>
        
        <el-menu-item index="/products" class="menu-item">
          <el-icon><Box /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        
        <el-menu-item index="/orders" class="menu-item">
          <el-icon><ShoppingCart /></el-icon>
          <span>訂單管理</span>
        </el-menu-item>
        
        <el-menu-item index="/members" class="menu-item">
          <el-icon><User /></el-icon>
          <span>會員管理</span>
        </el-menu-item>
        
        <el-menu-item index="/categories" class="menu-item">
          <el-icon><FolderOpened /></el-icon>
          <span>分類管理</span>
        </el-menu-item>
        
        <el-menu-item index="/finance" class="menu-item">
          <el-icon><Money /></el-icon>
          <span>財務報表</span>
        </el-menu-item>
        
        <el-menu-item index="/settings" class="menu-item">
          <el-icon><Setting /></el-icon>
          <span>系統設定</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主要內容區域 -->
    <el-container class="main-container">
      <!-- 頂部導航 -->
      <el-header class="topbar">
        <div class="topbar-left">
          <el-button 
            class="hamburger-btn"
            :icon="mobileSidebarVisible ? Close : Menu"
            @click="toggleMobileSidebar"
            v-if="isMobile"
          />
          <el-button 
            class="hamburger-btn"
            :icon="sidebarCollapsed ? Expand : Fold"
            @click="toggleSidebar"
            v-else
          />
          
          <!-- 面包屑導航 -->
          <el-breadcrumb class="breadcrumb" v-if="!isMobile">
            <el-breadcrumb-item>
              <el-icon><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="topbar-right">
          <!-- 通知 -->
          <el-badge :value="5" class="notification-badge">
            <el-button 
              class="icon-btn"
              :icon="Bell"
              @click="showNotifications"
            />
          </el-badge>
          
          <!-- 用戶菜單 -->
          <el-dropdown @command="handleUserMenuCommand" class="user-dropdown">
            <div class="user-profile">
              <el-avatar 
                :size="36"
                class="user-avatar"
                :src="userStore.userInfo.avatar"
              >
                {{ userStore.userInfo.name?.[0] || 'A' }}
              </el-avatar>
              <span v-if="!isMobile" class="user-name">{{ userStore.userInfo.name }}</span>
              <el-icon v-if="!isMobile"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">
                  個人資料
                </el-dropdown-item>
                <el-dropdown-item command="settings" :icon="Setting">
                  帳號設定
                </el-dropdown-item>
                <el-dropdown-item divided command="logout" :icon="SwitchButton">
                  登出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主要內容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
    
    <!-- 移動端遮罩 -->
    <div 
      v-if="isMobile && mobileSidebarVisible"
      class="mobile-overlay"
      @click="mobileSidebarVisible = false"
    />
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'
import {
  Menu, Close, Expand, Fold, House, Bell, User, ArrowDown,
  Setting, SwitchButton, TrendCharts, Box, ShoppingCart,
  FolderOpened, Money
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

// 響應式狀態
const sidebarCollapsed = ref(false)
const mobileSidebarVisible = ref(false)
const isMobile = ref(false)

// 計算屬性
const currentRoute = computed(() => route.path)
const currentPageTitle = computed(() => route.meta.title || '儀表板')

// 檢查是否為移動設備
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    mobileSidebarVisible.value = false
  }
}

// 切換側邊欄
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  mobileSidebarVisible.value = !mobileSidebarVisible.value
}

// 顯示通知
const showNotifications = () => {
  notificationStore.info('暫無新通知')
}

// 處理用戶菜單命令
const handleUserMenuCommand = async (command) => {
  switch (command) {
    case 'profile':
      notificationStore.info('個人資料功能開發中...')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await userStore.logout()
      notificationStore.success('已成功登出')
      router.push('/login')
      break
  }
}

// 生命週期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.sidebar {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--border);
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-section.collapsed {
  justify-content: center;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-menu {
  border: none;
  padding-top: 20px;
}

.main-container {
  min-height: 100vh;
}

.topbar {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hamburger-btn {
  background: rgba(0, 212, 255, 0.1) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-primary) !important;
}

.hamburger-btn:hover {
  background: rgba(0, 212, 255, 0.2) !important;
  border-color: var(--neon-blue) !important;
}

.breadcrumb {
  color: var(--text-secondary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  margin-right: 8px;
}

.icon-btn {
  background: rgba(0, 212, 255, 0.1) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-primary) !important;
  border-radius: 8px !important;
}

.icon-btn:hover {
  background: rgba(0, 212, 255, 0.2) !important;
  border-color: var(--neon-blue) !important;
}

.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--neon-blue);
}

.user-avatar {
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green)) !important;
  color: white !important;
  font-weight: 600;
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
}

.main-content {
  padding: 24px;
  background: transparent;
  min-height: calc(100vh - 64px);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 頁面切換動畫 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.mobile-show {
    transform: translateX(0);
  }
  
  .topbar {
    padding: 0 16px;
  }
  
  .main-content {
    padding: 16px;
  }
}
</style>