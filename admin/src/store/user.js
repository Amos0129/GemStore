import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiRequest } from '@/utils/api'

export const useUserStore = defineStore('user', () => {
  // 狀態
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // 計算屬性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value || { name: 'Admin', email: '' })

  // 登入
  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email || credentials.username + '@crystal-jewelry.com', // 支援直接傳 email
          password: credentials.password
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const userData = data.data.user
        const accessToken = data.data.accessToken
        
        user.value = {
          id: userData.id,
          username: userData.email.split('@')[0],
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role.toLowerCase(),
          avatar: userData.avatar,
          permissions: userData.role === 'ADMIN' ? ['all'] : []
        }
        
        token.value = accessToken
        localStorage.setItem('admin_token', accessToken)
        
        return { success: true }
      } else {
        throw new Error(data.message || '帳號或密碼錯誤')
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
      
      const response = await apiRequest('/auth/me')
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const userData = data.data
        user.value = {
          id: userData.id,
          username: userData.email.split('@')[0],
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role.toLowerCase(),
          avatar: userData.avatar,
          permissions: userData.role === 'ADMIN' ? ['all'] : []
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
      
      const response = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // 重新獲取用戶資訊
        await checkAuth()
        return { success: true }
      } else {
        throw new Error(data.message || '更新失敗')
      }
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
      
      const response = await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { success: true }
      } else {
        throw new Error(data.message || '密碼修改失敗')
      }
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