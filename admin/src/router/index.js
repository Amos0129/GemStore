import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, title: '儀表板' }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { requiresAuth: true, title: '商品管理' }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true, title: '訂單管理' }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('@/views/MembersView.vue'),
    meta: { requiresAuth: true, title: '會員管理' }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: { requiresAuth: true, title: '分類管理' }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/FinanceView.vue'),
    meta: { requiresAuth: true, title: '財務報表' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true, title: '系統設定' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 設置頁面標題
  if (to.meta.title) {
    document.title = `${to.meta.title} - NEXUS ADMIN`
  } else {
    document.title = 'NEXUS ADMIN - 晶礦飾品管理系統'
  }
  
  // 檢查認證狀態
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  if (to.meta.requiresGuest && userStore.isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router