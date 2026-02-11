<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Mobile Menu Button (Left) -->
      <button 
        class="mobile-menu-btn md:hidden"
        @click="toggleMobileMenu"
        :class="{ active: showMobileMenu }"
      >
        <i class="fas fa-bars"></i>
      </button>
      
      <!-- Logo -->
      <router-link to="/" class="logo">
        晶礦飾品
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
          <router-link to="/" @click="closeMobileMenu" class="sidebar-link">
            <i class="fas fa-home"></i>
            <span>首頁</span>
          </router-link>
          
          <router-link to="/products" @click="closeMobileMenu" class="sidebar-link">
            <i class="fas fa-gem"></i>
            <span>商品</span>
          </router-link>
          
          <!-- Categories -->
          <div class="sidebar-section">
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
          
          <!-- User Actions -->
          <div class="sidebar-section" v-if="userStore.isLoggedIn">
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
          
          <div class="sidebar-section" v-else>
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

const categories = computed(() => productsStore.categories)

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
  await userStore.logout()
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  @apply fixed top-0 left-0 right-0 z-50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(196, 181, 253, 0.2);
}

.nav-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center;
}

.logo {
  @apply text-2xl font-bold no-underline transition-colors duration-300 mr-8;
  color: #8B5CF6;
}

.logo:hover {
  color: #F8BBD9;
}

.mobile-menu-btn {
  @apply bg-none border-none text-xl cursor-pointer p-2;
  color: #8B5CF6;
}

.nav-links {
  @apply items-center space-x-8 list-none flex-1 justify-center;
}

/* Remove old mobile dropdown styles */

.nav-links a {
  @apply no-underline font-medium transition-colors duration-300 relative;
  color: #6B21A8;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #F8BBD9;
}

.nav-links a::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300;
  background-color: #F8BBD9;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  @apply w-full;
}

.dropdown {
  @apply relative;
}

.dropdown-toggle {
  @apply bg-none border-none font-medium cursor-pointer flex items-center space-x-1;
  color: #6B21A8;
}

.dropdown-toggle:hover {
  color: #F8BBD9;
}

.dropdown-toggle i {
  color: #C4B5FD;
}

.dropdown-menu {
  @apply absolute top-full left-0 rounded-lg py-2 min-w-64 opacity-0 invisible translate-y-2 transition-all duration-300;
  background-color: #FFFFFF;
  border: 1px solid rgba(196, 181, 253, 0.2);
}

.dropdown:hover .dropdown-menu {
  @apply opacity-100 visible translate-y-0;
}

.dropdown-menu a {
  @apply flex items-center space-x-2 px-4 py-2 no-underline transition-colors duration-300;
  color: #6B21A8;
}

.dropdown-menu a:hover {
  background-color: rgba(248, 187, 217, 0.15);
  color: #F8BBD9;
}

.dropdown-menu a i {
  color: #C4B5FD;
}

.nav-tools {
  @apply flex items-center space-x-8 transition-all duration-300;
}

.nav-tools.search-mode {
  @apply space-x-2;
}

.search-box {
  @apply relative transition-all duration-300;
}

.search-box.expanded {
  @apply flex-1;
}

.search-input {
  @apply rounded-full py-2 px-4 pr-12 w-0 transition-all duration-300 outline-none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(196, 181, 253, 0.3);
  color: #6B21A8;
}

.search-input::placeholder {
  color: #A78BFA;
}

.search-input.active {
  @apply w-64;
  background-color: #FFFFFF;
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
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer transition-colors duration-300;
  color: #8B5CF6;
}

.search-btn:hover {
  color: #F8BBD9;
}

.icon-btn {
  @apply bg-none border-none text-lg cursor-pointer relative transition-colors duration-300;
  color: #8B5CF6;
}

.icon-btn:hover {
  color: #F8BBD9;
}

.user-menu {
  @apply relative;
}

.user-btn {
  @apply bg-none border-none text-lg cursor-pointer;
  color: #8B5CF6;
}

.user-avatar {
  @apply w-8 h-8 rounded-full object-cover;
}

.user-dropdown {
  @apply absolute top-full right-0 rounded-lg py-2 min-w-64 mt-2;
  background-color: #FFFFFF;
  border: 1px solid rgba(196, 181, 253, 0.2);
}

.user-info {
  @apply px-4 py-2;
}

.user-name {
  @apply font-semibold;
  color: #6B21A8;
}

.user-email {
  @apply text-sm;
  color: #A78BFA;
}

.user-dropdown a,
.logout-btn {
  @apply flex items-center space-x-2 px-4 py-2 no-underline transition-colors duration-300 w-full text-left bg-none border-none cursor-pointer;
  color: #6B21A8;
}

.user-dropdown a:hover,
.logout-btn:hover {
  background-color: rgba(248, 187, 217, 0.15);
  color: #F8BBD9;
}

.user-dropdown a i,
.logout-btn i {
  color: #C4B5FD;
}

.cart-badge {
  @apply absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center;
  background-color: #F8BBD9;
  color: #581C87;
}

/* Removed login button border styling */

hr {
  @apply border-accent-blue/20 my-2;
}

/* Mobile Sidebar Styles */
.mobile-sidebar-overlay {
  @apply fixed inset-0 bg-black/50 opacity-0 invisible transition-all duration-300;
  z-index: 55;
}

.mobile-sidebar-overlay.active {
  @apply opacity-100 visible;
}

.mobile-sidebar {
  @apply fixed left-0 top-0 h-screen w-80 max-w-xs bg-white flex flex-col transform -translate-x-full transition-transform duration-300 shadow-2xl;
  z-index: 60;
}

.mobile-sidebar.active {
  @apply translate-x-0;
}

.sidebar-header {
  @apply flex items-center justify-between p-6 border-b;
  border-color: rgba(196, 181, 253, 0.2);
  background-color: #F8F7FF;
}

.sidebar-title {
  @apply text-xl font-bold;
  color: #8B5CF6;
}

.close-sidebar {
  @apply bg-none border-none text-xl cursor-pointer p-2 transition-colors duration-300;
  color: #6B21A8;
}

.close-sidebar:hover {
  color: #F8BBD9;
}

.sidebar-nav {
  @apply flex-1 overflow-y-auto p-4;
}

.sidebar-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 no-underline mb-1;
  color: #6B21A8;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: rgba(196, 181, 253, 0.15);
  color: #8B5CF6;
}

.sidebar-link i {
  @apply w-5 text-center;
  color: #C4B5FD;
}

.sidebar-link:hover i,
.sidebar-link.router-link-active i {
  color: #8B5CF6;
}

.sidebar-section {
  @apply mt-6 mb-4;
}

.section-title {
  @apply text-sm font-semibold px-4 py-2 uppercase tracking-wider;
  color: #A78BFA;
}

.subcategory {
  @apply ml-4 text-sm;
}

.logout-link {
  @apply w-full text-left bg-none border-none cursor-pointer;
}

/* Mobile styles */
@media (max-width: 768px) {
  .nav-container {
    @apply px-3 h-16 justify-between;
  }
  
  .mobile-menu-btn {
    @apply p-1;
    flex: 0 0 auto;
  }
  
  .logo {
    @apply text-xl absolute left-1/2 transform -translate-x-1/2;
  }
  
  .nav-links {
    @apply hidden;
  }
  
  .nav-tools {
    @apply space-x-6;
    flex: 0 0 auto;
  }
  
  .nav-tools.search-mode {
    @apply absolute left-3 right-3 top-1/2 transform -translate-y-1/2 space-x-2;
  }
  
  .mobile-sidebar {
    @apply w-full max-w-sm;
  }
  
  .dropdown-menu {
    @apply min-w-52 py-1;
  }
  
  .dropdown-menu a {
    @apply px-3 py-1.5 text-sm;
  }
  
  
  .search-input.active {
    @apply w-full;
  }
  
  .icon-btn {
    @apply text-base p-1;
  }
  
  .user-dropdown {
    @apply right-auto left-0 min-w-48;
  }
  
  .user-dropdown a,
  .logout-btn {
    @apply px-3 py-2 text-sm;
  }
}

@media (max-width: 480px) {
  .nav-container {
    @apply px-2 h-14;
  }
  
  .logo {
    @apply text-base;
  }
  
  .nav-tools {
    @apply space-x-4;
  }
  
  .nav-tools.search-mode {
    @apply space-x-1;
  }
  
  .search-input.active {
    @apply w-32 py-1.5 px-3 text-sm;
  }
  
  .search-btn {
    @apply right-2;
  }
  
  .icon-btn {
    @apply text-sm;
  }
  
  .cart-badge {
    @apply -top-1 -right-1 w-4 h-4 text-xs;
  }
}
</style>