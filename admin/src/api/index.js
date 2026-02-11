import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

// 創建 axios 實例
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
adminApi.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
adminApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const userStore = useUserStore()
    
    if (error.response?.status === 401) {
      ElMessage.error('登入已過期，請重新登入')
      userStore.logout()
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      ElMessage.error('伺服器錯誤，請稍後再試')
    } else if (error.message === 'Network Error') {
      ElMessage.error('網路連接錯誤')
    }
    
    return Promise.reject(error)
  }
)

// API 方法
export default {
  // 認證相關
  auth: {
    login: (credentials) => adminApi.post('/auth/login', credentials),
    logout: () => adminApi.post('/auth/logout'),
    me: () => adminApi.get('/auth/me'),
    changePassword: (data) => adminApi.post('/auth/change-password', data)
  },

  // 儀表板相關
  dashboard: {
    getStats: () => adminApi.get('/dashboard/stats'),
    getSalesChart: (params = {}) => adminApi.get('/dashboard/sales-chart', { params }),
    getCategoryChart: () => adminApi.get('/dashboard/category-chart'),
    getTopProducts: (limit = 5) => adminApi.get(`/dashboard/top-products?limit=${limit}`),
    getRecentOrders: (limit = 10) => adminApi.get(`/dashboard/recent-orders?limit=${limit}`)
  },

  // 商品管理
  products: {
    getAll: (params = {}) => adminApi.get('/products', { params }),
    getById: (id) => adminApi.get(`/products/${id}`),
    create: (data) => adminApi.post('/products', data),
    update: (id, data) => adminApi.put(`/products/${id}`, data),
    delete: (id) => adminApi.delete(`/products/${id}`),
    updateStock: (id, stock) => adminApi.patch(`/products/${id}/stock`, { stock }),
    updateStatus: (id, status) => adminApi.patch(`/products/${id}/status`, { status })
  },

  // 訂單管理
  orders: {
    getAll: (params = {}) => adminApi.get('/orders', { params }),
    getById: (id) => adminApi.get(`/orders/${id}`),
    updateStatus: (id, status) => adminApi.patch(`/orders/${id}/status`, { status }),
    getOrderStats: () => adminApi.get('/orders/stats')
  },

  // 會員管理
  members: {
    getAll: (params = {}) => adminApi.get('/members', { params }),
    getById: (id) => adminApi.get(`/members/${id}`),
    update: (id, data) => adminApi.put(`/members/${id}`, data),
    updateStatus: (id, status) => adminApi.patch(`/members/${id}/status`, { status }),
    getMemberStats: () => adminApi.get('/members/stats')
  },

  // 分類管理
  categories: {
    getAll: () => adminApi.get('/categories'),
    getById: (id) => adminApi.get(`/categories/${id}`),
    create: (data) => adminApi.post('/categories', data),
    update: (id, data) => adminApi.put(`/categories/${id}`, data),
    delete: (id) => adminApi.delete(`/categories/${id}`),
    updateOrder: (orders) => adminApi.post('/categories/reorder', { orders })
  },

  // 財務報表
  finance: {
    getRevenue: (params = {}) => adminApi.get('/finance/revenue', { params }),
    getExpenses: (params = {}) => adminApi.get('/finance/expenses', { params }),
    getProfit: (params = {}) => adminApi.get('/finance/profit', { params }),
    getRevenueChart: (params = {}) => adminApi.get('/finance/revenue-chart', { params })
  },

  // 系統設定
  settings: {
    get: () => adminApi.get('/settings'),
    update: (data) => adminApi.put('/settings', data),
    uploadLogo: (file) => {
      const formData = new FormData()
      formData.append('logo', file)
      return adminApi.post('/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
  },

  // 文件上傳
  upload: {
    image: (file) => {
      const formData = new FormData()
      formData.append('image', file)
      return adminApi.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    images: (files) => {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`images`, file)
      })
      return adminApi.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
  }
}