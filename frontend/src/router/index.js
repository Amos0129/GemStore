import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: '首頁 - 晶礦飾品' }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/Products.vue'),
    meta: { title: '商品列表 - 晶礦飾品' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetail.vue'),
    meta: { title: '商品詳情 - 晶礦飾品' }
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: () => import('@/pages/Category.vue'),
    meta: { title: '商品分類 - 晶礦飾品' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/Cart.vue'),
    meta: { title: '購物車 - 晶礦飾品' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/pages/Checkout.vue'),
    meta: { title: '結帳 - 晶礦飾品', requiresAuth: true }
  },
  {
    path: '/auth',
    component: () => import('@/pages/Auth.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/auth/LoginForm.vue'),
        meta: { title: '登入 - 晶礦飾品' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/components/auth/RegisterForm.vue'),
        meta: { title: '註冊 - 晶礦飾品' }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { title: '個人中心 - 晶礦飾品', requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/profile/info'
      },
      {
        path: 'info',
        name: 'ProfileInfo',
        component: () => import('@/components/profile/ProfileInfo.vue'),
        meta: { title: '個人資訊 - 晶礦飾品' }
      },
      {
        path: 'orders',
        name: 'ProfileOrders',
        component: () => import('@/components/profile/ProfileOrders.vue'),
        meta: { title: '訂單記錄 - 晶礦飾品' }
      },
      {
        path: 'wishlist',
        name: 'ProfileWishlist',
        component: () => import('@/components/profile/ProfileWishlist.vue'),
        meta: { title: '收藏清單 - 晶礦飾品' }
      },
      {
        path: 'address',
        name: 'ProfileAddress',
        component: () => import('@/components/profile/ProfileAddress.vue'),
        meta: { title: '地址管理 - 晶礦飾品' }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue'),
    meta: { title: '關於我們 - 晶礦飾品' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/Contact.vue'),
    meta: { title: '聯絡我們 - 晶礦飾品' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/Search.vue'),
    meta: { title: '搜尋結果 - 晶礦飾品' }
  },
  {
    path: '/live',
    name: 'Live',
    component: () => import('@/pages/Live.vue'),
    meta: { title: '直播購物 - 晶礦飾品' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: { title: '頁面不存在 - 晶礦飾品' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 設置頁面標題
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 檢查是否需要登入
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  next()
})

export default router