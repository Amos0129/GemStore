<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <!-- Mobile Menu Button (Left) -->
      <button 
        class="mobile-menu-btn md:hidden"
        @click="toggleMobileMenu"
        :class="{ active: showMobileMenu }"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      
      <!-- Logo -->
      <router-link to="/" class="logo">
        <div class="logo-content">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" stroke-width="2"/>
              <path d="M22 7L12 12L2 7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="logo-text">CRYSTAL</span>
        </div>
      </router-link>
      
      <!-- Desktop Navigation Links -->
      <ul class="nav-links hidden md:flex">
        <li>
          <router-link to="/" @click="closeMobileMenu">首頁</router-link>
        </li>
        <li>
          <router-link to="/products" @click="closeMobileMenu">商品</router-link>
        </li>
        <li class="dropdown">
          <button class="dropdown-toggle">
            商品分類 <i class="fas fa-chevron-down"></i>
          </button>
          <ul class="dropdown-menu">
            <li v-for="category in categories" :key="category.id">
              <router-link 
                :to="`/category/${category.slug}`"
                @click="closeMobileMenu"
              >
                <i :class="category.icon"></i>
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link to="/about" @click="closeMobileMenu">關於我們</router-link>
        </li>
        <li>
          <router-link to="/contact" @click="closeMobileMenu">聯絡我們</router-link>
        </li>
      </ul>
      
      <!-- Navigation Tools -->
      <div class="nav-tools" :class="{ 'search-mode': showSearch }">
        <!-- Search -->
        <div class="search-box" :class="{ expanded: showSearch }">
          <input 
            type="text" 
            class="search-input" 
            :class="{ active: showSearch }"
            placeholder="搜尋商品..." 
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @blur="handleSearchBlur"
            ref="searchInput"
          />
          <button 
            class="search-btn" 
            @click="toggleSearch"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <!-- User Menu -->
        <div class="user-menu" v-if="userStore.isLoggedIn" v-show="!showSearch">
          <button class="user-btn" @click="toggleUserMenu">
            <img 
              v-if="userStore.userInfo.avatar" 
              :src="userStore.userInfo.avatar" 
              :alt="userStore.userInfo.firstName"
              class="user-avatar"
            />
            <i v-else class="fas fa-user"></i>
          </button>
          <div class="user-dropdown" v-show="showUserMenu">
            <div class="user-info">
              <p class="user-name">{{ userStore.userInfo.firstName }} {{ userStore.userInfo.lastName }}</p>
              <p class="user-email">{{ userStore.userInfo.email }}</p>
            </div>
            <hr />
            <router-link to="/profile" @click="closeUserMenu">
              <i class="fas fa-user"></i> 個人中心
            </router-link>
            <router-link to="/profile/orders" @click="closeUserMenu">
              <i class="fas fa-box"></i> 我的訂單
            </router-link>
            <router-link to="/profile/wishlist" @click="closeUserMenu">
              <i class="fas fa-heart"></i> 收藏清單
            </router-link>
            <hr />
            <button @click="handleLogout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> 登出
            </button>
          </div>
        </div>
        
        <!-- Login Button -->
        <router-link 
          v-else 
          to="/auth/login" 
          class="icon-btn"
          v-show="!showSearch"
        >
          <i class="fas fa-user"></i>
        </router-link>
        
        <!-- Cart Button -->
        <button 
          class="icon-btn cart-btn" 
          @click="cartStore.toggleCart"
          v-show="!showSearch"
        >
          <i class="fas fa-shopping-cart"></i>
          <span 
            v-if="cartStore.totalItems > 0"
            class="cart-badge"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Mobile Sidebar Menu -->
    <div class="mobile-sidebar-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu">
      <div class="mobile-sidebar" :class="{ active: showMobileMenu }" @click.stop>
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <h3 class="sidebar-title">選單</h3>
          <button class="close-sidebar" @click="closeMobileMenu">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Sidebar Navigation -->
        <nav class="sidebar-nav">
          <!-- Main Navigation -->
          <div class="menu-group main-menu">
            <router-link to="/" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-home"></i>
              <span>首頁</span>
            </router-link>
            
            <router-link to="/products" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-gem"></i>
              <span>商品</span>
            </router-link>
          </div>
          
          <!-- Categories -->
          <div class="menu-group categories-menu">
            <h4 class="section-title">商品分類</h4>
            <router-link 
              v-for="category in categories" 
              :key="category.id"
              :to="`/category/${category.slug}`"
              @click="closeMobileMenu"
              class="sidebar-link subcategory"
            >
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
            </router-link>
          </div>
          
          <!-- Info Pages -->
          <div class="menu-group info-menu">
            <router-link to="/about" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-info-circle"></i>
              <span>關於我們</span>
            </router-link>
            
            <router-link to="/contact" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-envelope"></i>
              <span>聯絡我們</span>
            </router-link>
            
            <router-link to="/live" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-video"></i>
              <span>直播購物</span>
            </router-link>
          </div>
          
          <!-- User Actions -->
          <div class="menu-group user-menu" v-if="userStore.isLoggedIn">
            <h4 class="section-title">我的帳戶</h4>
            <router-link to="/profile" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-user"></i>
              <span>個人中心</span>
            </router-link>
            <router-link to="/profile/orders" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-box"></i>
              <span>我的訂單</span>
            </router-link>
            <router-link to="/profile/wishlist" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-heart"></i>
              <span>收藏清單</span>
            </router-link>
            <button @click="handleLogout" class="sidebar-link logout-link">
              <i class="fas fa-sign-out-alt"></i>
              <span>登出</span>
            </button>
          </div>
          
          <div class="menu-group auth-menu" v-else>
            <router-link to="/auth/login" @click="closeMobileMenu" class="sidebar-link">
              <i class="fas fa-sign-in-alt"></i>
              <span>登入 / 註冊</span>
            </router-link>
          </div>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useCartStore } from '@/store/cart'
import { useProductStore } from '@/store/products'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const productsStore = useProductStore()

const showMobileMenu = ref(false)
const showSearch = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')
const isScrolled = ref(false)

const categories = computed(() => productsStore.categories)

// 滾動檢測
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    // Focus search input after transition
    setTimeout(() => {
      const input = document.querySelector('.search-input')
      if (input) input.focus()
    }, 100)
  } else if (searchQuery.value) {
    performSearch()
  }
}

const handleSearchBlur = () => {
  // Auto close search if empty and clicked outside
  setTimeout(() => {
    if (!searchQuery.value.trim()) {
      showSearch.value = false
    }
  }, 100)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'Search', 
      query: { q: searchQuery.value.trim() } 
    })
    showSearch.value = false
    searchQuery.value = ''
    closeMobileMenu()
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  await userStore.logout() // 會自動觸發購物車重置
  closeUserMenu()
  router.push('/')
}

// 點擊外部關閉菜單
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu')
  const mobileMenu = document.querySelector('.nav-links')
  
  if (showUserMenu.value && userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
  
  if (showMobileMenu.value && mobileMenu && !mobileMenu.contains(event.target)) {
    const mobileBtn = document.querySelector('.mobile-menu-btn')
    if (!mobileBtn || !mobileBtn.contains(event.target)) {
      showMobileMenu.value = false
    }
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
  // 載入分類資料
  if (productsStore.categories.length === 0) {
    await productsStore.fetchCategories()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  @apply fixed top-0 left-0 right-0 z-50 transition-all duration-300;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(46, 134, 171, 0.3);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  height: 80px;
}

.navbar.scrolled {
  @apply shadow-xl;
  background: rgba(255, 255, 255, 1);
  border-bottom: 2px solid rgba(46, 134, 171, 0.4);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  height: 70px;
}

.nav-container {
  @apply max-w-7xl mx-auto px-6 h-full flex items-center justify-between;
}

/* Logo 設計 */
.logo {
  @apply flex items-center space-x-3 text-xl font-bold transition-all duration-300;
  color: #2E86AB;
  text-decoration: none;
}

.logo:hover {
  color: #1B4F72;
}

.logo-content {
  @apply flex items-center space-x-3;
}

.logo-icon {
  @apply w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300;
  background: #2E86AB;
  color: white;
}

.logo-icon svg {
  @apply w-6 h-6;
}

.navbar.scrolled .logo-icon {
  @apply w-8 h-8;
}

.navbar.scrolled .logo-icon svg {
  @apply w-5 h-5;
}

.logo-text {
  @apply font-bold tracking-wider transition-all duration-300;
  font-size: 1.5rem;
  color: #2E86AB;
}

.navbar.scrolled .logo-text {
  font-size: 1.25rem;
}

/* 漢堡菜單 */
.mobile-menu-btn {
  @apply w-10 h-10 flex flex-col justify-center items-center space-y-1.5 bg-transparent border-none cursor-pointer transition-all duration-300 rounded-lg;
}

.mobile-menu-btn:hover {
  background: rgba(46, 134, 171, 0.1);
}

.hamburger-line {
  @apply w-6 h-0.5 transition-all duration-300;
  background: #2E86AB;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* 導航鏈接 */
.nav-links {
  @apply flex items-center space-x-8;
}

.nav-links li {
  @apply relative;
}

.nav-links a {
  @apply font-medium transition-all duration-300 relative py-2 px-1;
  text-decoration: none;
  position: relative;
  color: #1F2937;
}

.nav-links a::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300;
  background: #1B4F72;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  @apply w-full;
}

.nav-links a:hover {
  color: #2E86AB;
  transform: translateY(-1px);
}

/* 下拉菜單 */
.dropdown {
  @apply relative;
}

.dropdown-toggle {
  @apply font-medium transition-all duration-300 flex items-center space-x-2 py-2 px-1 bg-transparent border-none cursor-pointer;
  color: #1F2937;
}

.dropdown-toggle:hover {
  color: #2E86AB;
  transform: translateY(-1px);
}

.dropdown-menu {
  @apply absolute top-full left-0 mt-2 w-56 py-3 opacity-0 invisible transition-all duration-300 transform translate-y-2;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(46, 134, 171, 0.5);
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25), 0 5px 20px rgba(46, 134, 171, 0.3);
}

.dropdown:hover .dropdown-menu {
  @apply opacity-100 visible translate-y-0;
}

.dropdown-menu li {
  @apply block;
}

.dropdown-menu a {
  @apply block px-4 py-3 transition-all duration-200 flex items-center space-x-3 rounded-lg mx-2;
  text-decoration: none;
  color: #374151;
}

.dropdown-menu a:hover {
  background: rgba(46, 134, 171, 0.1);
  color: #2E86AB;
  transform: translateX(4px);
}

/* 導航工具 */
.nav-tools {
  @apply flex items-center space-x-4 transition-all duration-300;
}

.nav-tools.search-mode {
  @apply space-x-2;
}

/* 搜索框 */
.search-box {
  @apply relative flex items-center;
}

.search-box.expanded {
  @apply flex-1;
}

.search-input {
  @apply w-0 opacity-0 py-2 px-4 pr-10 rounded-full transition-all duration-300 border-none outline-none;
  background: rgba(173, 216, 230, 0.05);
  border: 1px solid rgba(46, 134, 171, 0.4);
}

.search-input.active {
  @apply w-64 opacity-100;
}

.search-input:focus {
  @apply ring-2;
  ring-color: rgba(255, 182, 193, 0.3);
  border-color: #1B4F72;
}

/* Mobile search full width */
@media (max-width: 768px) {
  .nav-tools.search-mode {
    @apply absolute left-3 right-3 top-1/2 transform -translate-y-1/2;
  }
  
  .search-box.expanded {
    @apply w-full;
  }
  
  .search-input.active {
    @apply w-full;
  }
}

.search-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer;
  color: #2E86AB;
}

.search-btn:hover {
  background: rgba(46, 134, 171, 0.1);
  transform: scale(1.05);
}

/* 購物車按鈕 */
.cart-btn {
  @apply relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer;
  color: #2E86AB;
}

.cart-btn:hover {
  background: rgba(46, 134, 171, 0.1);
  transform: scale(1.05);
}

.cart-badge {
  @apply absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center text-white;
  background: #1B4F72;
  animation: pulse 2s infinite;
}

/* 用戶菜單 */
.user-menu {
  @apply relative;
}

.user-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer;
  background: #2E86AB;
  color: white;
}

.user-btn:hover {
  transform: scale(1.05);
  background: #1B4F72;
}

.user-avatar {
  @apply w-8 h-8 rounded-full object-cover;
}

.user-dropdown {
  @apply absolute top-full right-0 mt-2 w-64 py-4 opacity-0 invisible transition-all duration-300 transform translate-y-2;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(46, 134, 171, 0.5);
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25), 0 5px 20px rgba(46, 134, 171, 0.3);
}

.user-menu:hover .user-dropdown {
  @apply opacity-100 visible translate-y-0;
}

.user-info {
  @apply px-4 pb-3 border-b border-gray-200;
}

.user-name {
  @apply font-medium text-gray-900 mb-1;
}

.user-email {
  @apply text-sm text-gray-500;
}

.user-dropdown a,
.logout-btn {
  @apply block px-4 py-3 transition-all duration-200 flex items-center space-x-3 w-full text-left bg-transparent border-none cursor-pointer;
  text-decoration: none;
  color: #374151;
}

.user-dropdown a:hover,
.logout-btn:hover {
  background: rgba(46, 134, 171, 0.1);
  color: #2E86AB;
}

/* 登入/註冊按鈕 */
.auth-buttons {
  @apply flex items-center space-x-3;
}

.auth-btn {
  @apply px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm;
  text-decoration: none;
}

.auth-btn.login {
  @apply border border-gray-400;
  color: #1F2937;
}

.auth-btn.login:hover {
  border-color: #2E86AB;
  color: #2E86AB;
}

.auth-btn.register {
  @apply text-white;
  background: #1B4F72;
}

.auth-btn.register:hover {
  transform: translateY(-1px);
  background: #2E86AB;
}

/* 動畫 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 移動端適配 */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 1rem;
  }
  
  .nav-container {
    @apply px-4;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .search-input.active {
    @apply w-40;
  }
}

/* 移動端側邊欄樣式 */
.mobile-sidebar-overlay {
  @apply fixed inset-0 opacity-0 invisible transition-all duration-300;
  background: rgba(0, 0, 0, 0.6);
  z-index: 55;
}

.mobile-sidebar-overlay.active {
  @apply opacity-100 visible;
}

.mobile-sidebar {
  @apply fixed top-0 left-0 h-full w-80 transform -translate-x-full transition-transform duration-300;
  background: #FFFFFF !important;
  opacity: 1 !important;
  border-right: 3px solid #2E86AB;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
  z-index: 60;
  max-width: 85vw;
}

.mobile-sidebar.active {
  @apply translate-x-0;
}

.sidebar-header {
  @apply flex items-center justify-between p-6 border-b-2;
  border-bottom-color: #2E86AB;
  background: #FFFFFF !important;
}

.sidebar-title {
  @apply text-xl font-bold;
  color: #1B4F72;
  margin: 0;
}

.close-sidebar {
  @apply w-10 h-10 flex items-center justify-center rounded-full border-none cursor-pointer transition-all duration-300;
  background: #E0F2FE;
  border: 2px solid #2E86AB;
  color: #1B4F72;
}

.close-sidebar:hover {
  background: #2E86AB;
  color: white;
  transform: rotate(90deg) scale(1.1);
  border-color: #1B4F72;
}

.sidebar-nav {
  @apply flex flex-col p-6;
  background: #FFFFFF !important;
}

.sidebar-link {
  @apply flex items-center space-x-3 px-4 py-4 transition-all duration-300;
  color: #374151;
  text-decoration: none;
  border-bottom: 1px solid #E5E7EB;
}

.sidebar-link:hover {
  background: #F1F5F9;
  color: #1E293B;
  padding-left: 20px;
}

.sidebar-link.router-link-active {
  background: #EFF6FF;
  color: #1E40AF;
  font-weight: 600;
  padding-left: 20px;
  border-left: 3px solid #2E86AB;
}

.sidebar-section {
  @apply mt-6 mb-4;
}

.section-title {
  @apply text-sm font-semibold px-4 py-4 mt-6 mb-2;
  color: #64748B;
  border-bottom: 1px solid #D1D5DB;
}

.sidebar-link.subcategory {
  @apply ml-4;
  font-size: 0.875rem;
}

.sidebar-link.logout-link {
  @apply bg-transparent border-none w-full text-left cursor-pointer;
}

.sidebar-link.logout-link:hover {
  color: #DC2626;
  background: #FEF2F2;
}

/* Remove menu group styles - keep it simple */
.menu-group {
  margin-bottom: 0;
}

/* 修復移動端其他樣式 */
@media (max-width: 768px) {
  .sidebar-link {
    @apply text-sm;
  }
  
  .mobile-sidebar {
    @apply w-72;
  }
}

/* 修復漢堡菜單圖標按鈕樣式 */
.icon-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer relative;
  color: #2E86AB;
}

.icon-btn:hover {
  background: rgba(46, 134, 171, 0.1);
  transform: scale(1.05);
}
</style>
