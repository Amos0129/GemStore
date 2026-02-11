import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 狀態
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // 計算屬性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value || {})

  // 登入
  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      // 模擬登入 - 在實際應用中這裡會調用真實的 API
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const mockUser = {
          id: 1,
          username: 'admin',
          name: '系統管理員',
          email: 'admin@crystal-jewelry.com',
          role: 'admin',
          avatar: null,
          permissions: ['all']
        }
        
        const mockToken = 'mock-admin-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('admin_token', mockToken)
        
        return { success: true }
      } else {
        throw new Error('帳號或密碼錯誤')
      }
    } catch (err) {
      error.value = err.message || '登入失敗'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 檢查認證狀態
  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      isLoading.value = true
      
      // 模擬檢查認證 - 在實際應用中這裡會調用真實的 API
      if (token.value.startsWith('mock-admin-token')) {
        user.value = {
          id: 1,
          username: 'admin',
          name: '系統管理員',
          email: 'admin@crystal-jewelry.com',
          role: 'admin',
          avatar: null,
          permissions: ['all']
        }
        return true
      } else {
        throw new Error('Token 無效')
      }
    } catch (err) {
      console.error('認證檢查失敗:', err)
      logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      // 在實際應用中這裡可以調用登出 API
      user.value = null
      token.value = null
      localStorage.removeItem('admin_token')
      error.value = null
    } catch (err) {
      console.error('登出失敗:', err)
    }
  }

  // 更新用戶資訊
  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      error.value = null
      
      // 模擬更新 - 在實際應用中這裡會調用真實的 API
      user.value = { ...user.value, ...profileData }
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '更新失敗'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 修改密碼
  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true
      error.value = null
      
      // 模擬修改密碼 - 在實際應用中這裡會調用真實的 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '密碼修改失敗'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 狀態
    user,
    token,
    isLoading,
    error,
    
    // 計算屬性
    isLoggedIn,
    userInfo,
    
    // 方法
    login,
    checkAuth,
    logout,
    updateProfile,
    changePassword
  }
})