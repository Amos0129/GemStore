// API 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// 創建 fetch 包裝器
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') ? 
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${endpoint}` :
    `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // 合併選項
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  // 如果有 token，添加到 headers
  const token = localStorage.getItem('admin_token')
  if (token) {
    finalOptions.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, finalOptions)
    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 導出 API 基礎 URL
export { API_BASE_URL }