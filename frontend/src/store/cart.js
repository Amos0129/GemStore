import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { api } from '@/api'

export const useCartStore = defineStore('cart', () => {
  // 狀態
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const isOpen = ref(false)
  const isLoading = ref(false)
  const userStore = useUserStore()

  // 計算屬性
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // 保存到本地存儲
  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // 從後端同步購物車
  const syncFromBackend = async () => {
    if (!userStore.isLoggedIn) return
    
    try {
      isLoading.value = true
      const response = await api.get('/cart')
      
      if (response.data?.success && response.data?.data?.items) {
        items.value = response.data.data.items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          cartItemId: item.id // 後端購物車項目ID
        }))
        
        // 清除本地存儲，因為已經從後端載入
        localStorage.removeItem('cart')
      }
    } catch (error) {
      console.error('同步購物車失敗:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 遷移本地購物車到後端
  const migrateToBackend = async () => {
    if (!userStore.isLoggedIn) return
    
    const localItems = JSON.parse(localStorage.getItem('cart') || '[]')
    if (localItems.length === 0) return
    
    try {
      for (const item of localItems) {
        await api.post('/cart/add', {
          productId: item.id,
          quantity: item.quantity
        })
      }
      
      // 遷移完成後重新同步
      await syncFromBackend()
      
      // 清除本地購物車
      localStorage.removeItem('cart')
    } catch (error) {
      console.error('遷移購物車失敗:', error)
    }
  }

  // 添加商品到購物車
  const addItem = async (product) => {
    if (userStore.isLoggedIn) {
      // 已登入用戶：使用後端API
      try {
        isLoading.value = true
        await api.post('/cart/add', {
          productId: product.id,
          quantity: 1
        })
        
        // 重新同步購物車
        await syncFromBackend()
      } catch (error) {
        console.error('加入購物車失敗:', error)
        throw error
      } finally {
        isLoading.value = false
      }
    } else {
      // 未登入用戶：使用本地存儲
      const existingItem = items.value.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        items.value.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          category: product.category
        })
      }
      
      saveToStorage()
    }
  }

  // 移除商品
  const removeItem = async (productId) => {
    if (userStore.isLoggedIn) {
      // 已登入用戶：使用後端API
      try {
        const item = items.value.find(item => item.id === productId)
        if (item && item.cartItemId) {
          isLoading.value = true
          await api.delete(`/cart/${item.cartItemId}`)
          await syncFromBackend()
        }
      } catch (error) {
        console.error('移除商品失敗:', error)
      } finally {
        isLoading.value = false
      }
    } else {
      // 未登入用戶：使用本地存儲
      const index = items.value.findIndex(item => item.id === productId)
      if (index > -1) {
        items.value.splice(index, 1)
        saveToStorage()
      }
    }
  }

  // 更新數量
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }
    
    if (userStore.isLoggedIn) {
      // 已登入用戶：使用後端API
      try {
        const item = items.value.find(item => item.id === productId)
        if (item && item.cartItemId) {
          isLoading.value = true
          await api.put(`/cart/${item.cartItemId}`, { quantity })
          await syncFromBackend()
        }
      } catch (error) {
        console.error('更新數量失敗:', error)
      } finally {
        isLoading.value = false
      }
    } else {
      // 未登入用戶：使用本地存儲
      const item = items.value.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  // 清空購物車
  const clearCart = async () => {
    if (userStore.isLoggedIn) {
      // 已登入用戶：使用後端API
      try {
        isLoading.value = true
        await api.delete('/cart')
        items.value = []
      } catch (error) {
        console.error('清空購物車失敗:', error)
      } finally {
        isLoading.value = false
      }
    } else {
      // 未登入用戶：使用本地存儲
      items.value = []
      saveToStorage()
    }
  }

  // 重置購物車（登出時使用）
  const resetCart = () => {
    items.value = []
    localStorage.removeItem('cart')
  }

  // 處理用戶登入後的購物車同步
  const handleUserLogin = async () => {
    try {
      // 檢查是否有本地購物車資料需要遷移
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      if (localCart.length > 0) {
        // 如果有本地購物車，先遷移到後端
        await migrateToBackend()
      } else {
        // 如果沒有本地購物車，直接從後端載入
        await syncFromBackend()
      }
    } catch (error) {
      console.error('登入後購物車同步失敗:', error)
    }
  }

  // 監聽用戶登出事件
  const handleUserLogout = () => {
    resetCart()
  }

  // 設置事件監聽器
  if (typeof window !== 'undefined') {
    window.addEventListener('user-login', handleUserLogin)
    window.addEventListener('user-logout', handleUserLogout)
  }

  // 初始化購物車：如果用戶已登入，嘗試從後端載入購物車
  if (userStore.isLoggedIn) {
    // 使用 nextTick 確保所有響應式狀態都已設置
    setTimeout(() => {
      handleUserLogin()
    }, 0)
  }

  // 切換購物車顯示狀態
  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  // 打開購物車
  const openCart = () => {
    isOpen.value = true
  }

  // 關閉購物車
  const closeCart = () => {
    isOpen.value = false
  }

  return {
    // 狀態
    items,
    isOpen,
    isLoading,
    
    // 計算屬性
    totalItems,
    totalPrice,
    isEmpty,
    
    // 方法
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    resetCart,
    toggleCart,
    openCart,
    closeCart,
    syncFromBackend,
    migrateToBackend,
    handleUserLogin
  }
})