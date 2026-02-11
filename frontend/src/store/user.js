import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 狀態
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
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
      
      const response = await api.post('/auth/login', credentials)
      const { user: userData, token: userToken } = response.data
      
      user.value = userData
      token.value = userToken
      localStorage.setItem('token', userToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || '登入失敗'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 註冊
  const register = async (userData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post('/auth/register', userData)
      const { user: newUser, token: userToken } = response.data
      
      user.value = newUser
      token.value = userToken
      localStorage.setItem('token', userToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || '註冊失敗'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    error.value = null
  }

  // 取得用戶資訊
  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      isLoading.value = true
      const response = await api.get('/auth/me')
      user.value = response.data
    } catch (err) {
      console.error('Failed to fetch user info:', err)
      if (err.response?.status === 401) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  // 更新用戶資訊
  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.put('/auth/profile', profileData)
      user.value = { ...user.value, ...response.data }
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || '更新失敗'
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
      
      await api.post('/auth/change-password', passwordData)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || '密碼修改失敗'
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
    register,
    logout,
    fetchUserInfo,
    updateProfile,
    changePassword
  }
})