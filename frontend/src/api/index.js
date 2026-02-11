import axios from 'axios'
import { useUserStore } from '@/store/user'

// 創建 axios 實例
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const userStore = useUserStore()
    
    if (error.response?.status === 401) {
      userStore.logout()
      window.location.href = '/auth/login'
    }
    
    return Promise.reject(error)
  }
)

// API 方法
export default {
  // 認證相關
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.post('/auth/change-password', data)
  },

  // 商品相關
  products: {
    getAll: (params = {}) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getByCategory: (category) => api.get(`/products/category/${category}`),
    search: (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`)
  },

  // 分類相關
  categories: {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`)
  },

  // 購物車相關
  cart: {
    getCart: () => api.get('/cart'),
    addItem: (data) => api.post('/cart/items', data),
    updateItem: (id, data) => api.put(`/cart/items/${id}`, data),
    removeItem: (id) => api.delete(`/cart/items/${id}`),
    clearCart: () => api.delete('/cart')
  },

  // 訂單相關
  orders: {
    create: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
  },

  // 願望清單相關
  wishlist: {
    getAll: () => api.get('/wishlist'),
    add: (productId) => api.post('/wishlist', { productId }),
    remove: (productId) => api.delete(`/wishlist/${productId}`)
  },

  // 地址相關
  addresses: {
    getAll: () => api.get('/addresses'),
    create: (data) => api.post('/addresses', data),
    update: (id, data) => api.put(`/addresses/${id}`, data),
    delete: (id) => api.delete(`/addresses/${id}`)
  },

  // 評論相關
  reviews: {
    getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`)
  }
}