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
        text-color="var(--text-primary)"
        active-text-color="var(--primary)"
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
          <el-popover
            v-model:visible="showNotificationPanel"
            placement="bottom"
            :width="360"
            trigger="click"
            popper-class="notification-popover"
          >
            <template #reference>
              <div class="notification-btn" @click="loadNotifications">
                <el-icon class="notification-icon">
                  <Bell />
                </el-icon>
                <span v-if="unreadCount > 0" class="notification-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
              </div>
            </template>
            
            <div class="notification-panel">
              <div class="notification-header">
                <h4>通知</h4>
                <div class="notification-actions">
                  <el-button size="small" text @click="markAllAsRead" v-if="unreadCount > 0">
                    全部已讀
                  </el-button>
                </div>
              </div>
              
              <div class="notification-list" v-if="notifications.length > 0">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.isRead }"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</div>
                  </div>
                  <div class="notification-indicator" v-if="!notification.isRead"></div>
                </div>
              </div>
              
              <div class="notification-empty" v-else>
                <el-empty description="暫無通知" :image-size="60" />
              </div>
            </div>
          </el-popover>
          
          <!-- 用戶菜單 -->
          <el-dropdown @command="handleUserMenuCommand" class="user-dropdown">
            <div class="user-profile">
              <el-avatar 
                :size="32"
                class="user-avatar"
                :src="userStore.userInfo.avatar"
              >
                {{ userStore.userInfo.name?.[0] || 'A' }}
              </el-avatar>
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
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
import { apiRequest } from '@/utils/api'
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
const notifications = ref([])
const unreadCount = ref(0)
const showNotificationPanel = ref(false)

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

// 載入通知
const loadNotifications = async () => {
  try {
    const response = await apiRequest('/admin/notifications?limit=10')
    const data = await response.json()
    
    if (data.success) {
      notifications.value = data.data.notifications
      unreadCount.value = data.data.unreadCount
    }
  } catch (error) {
    console.error('載入通知失敗:', error)
  }
}

// 標記所有通知為已讀
const markAllAsRead = async () => {
  try {
    const response = await apiRequest('/admin/notifications/read-all', {
      method: 'PUT'
    })
    
    if (response.ok) {
      unreadCount.value = 0
      notifications.value.forEach(n => {
        n.isRead = true
        n.readAt = new Date()
      })
      notificationStore.success('所有通知已標記為已讀')
    }
  } catch (error) {
    console.error('標記通知失敗:', error)
  }
}

// 處理通知點擊
const handleNotificationClick = async (notification) => {
  if (!notification.isRead) {
    try {
      await apiRequest(`/admin/notifications/${notification.id}/read`, {
        method: 'PUT'
      })
      
      notification.isRead = true
      notification.readAt = new Date()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch (error) {
      console.error('標記通知已讀失敗:', error)
    }
  }
  
  // 根據通知類型導航到相應頁面
  if (notification.data?.orderId) {
    router.push('/orders')
  } else if (notification.data?.productId) {
    router.push('/products')
  } else if (notification.data?.userId) {
    router.push('/members')
  }
  
  showNotificationPanel.value = false
}

// 格式化通知時間
const formatNotificationTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '剛剛'
  if (minutes < 60) return `${minutes}分鐘前`
  if (hours < 24) return `${hours}小時前`
  if (days < 7) return `${days}天前`
  
  return time.toLocaleDateString('zh-TW')
}

// 處理用戶菜單命令
const handleUserMenuCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/account-settings')
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
  loadNotifications()
  window.addEventListener('resize', checkMobile)
  
  // 定期刷新通知
  setInterval(loadNotifications, 30000) // 每30秒刷新一次
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
  display: flex;
  align-items: center;
  min-height: 88px;
  box-sizing: border-box;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-section.collapsed {
  justify-content: center;
  width: 100%;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  background: var(--primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: var(--shadow);
  flex-shrink: 0;
}

.sidebar-logo i {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
}

.sidebar-menu {
  border: none;
  padding-top: 20px;
}

.main-container {
  min-height: 100vh;
  background: var(--bg-primary);
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
  background: var(--bg-hover) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-primary) !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 6px !important;
}

.hamburger-btn:hover {
  background: var(--primary-light) !important;
  border-color: var(--primary) !important;
}

.hamburger-btn .el-icon {
  font-size: 18px !important;
  width: 18px !important;
  height: 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.breadcrumb {
  color: var(--text-secondary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 通知按鈕樣式 */
.notification-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 12px;
}

.notification-btn:hover {
  background: var(--primary-light);
}

.notification-icon {
  font-size: 16px;
  color: var(--text-primary);
}

.notification-btn:hover .notification-icon {
  color: var(--primary);
}

.notification-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 0 0 2px white;
}

.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--bg-hover);
  transition: background-color 0.2s ease;
}

.user-profile:hover {
  background: var(--primary-light);
}

.user-avatar {
  background: var(--primary) !important;
  color: white !important;
  font-weight: 600;
}

.dropdown-arrow {
  font-size: 14px;
  color: var(--text-secondary);
}

.user-profile:hover .dropdown-arrow {
  color: var(--primary);
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

/* 通知面板樣式 */
:deep(.notification-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.notification-panel {
  max-height: 400px;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
}

.notification-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: var(--bg-hover);
}

.notification-item.unread {
  background: var(--primary-light);
  border-left: 3px solid var(--primary);
}

.notification-content {
  position: relative;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 8px;
}

.notification-time {
  font-size: 12px;
  color: var(--text-muted);
}

.notification-indicator {
  position: absolute;
  top: 50%;
  right: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  transform: translateY(-50%);
}

.notification-empty {
  padding: 40px 20px;
  text-align: center;
}
</style>