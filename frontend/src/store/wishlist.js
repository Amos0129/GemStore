import { defineStore } from 'pinia'
import { api } from '@/api'
import { useUserStore } from './user'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null
  }),

  getters: {
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    },

    itemCount: (state) => state.items.length
  },

  actions: {
    // 從後台獲取收藏清單
    async fetchWishlist() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        this.items = []
        return
      }

      try {
        this.isLoading = true
        this.error = null

        const response = await api.get('/wishlist')
        
        if (response.data?.success && response.data?.data) {
          this.items = response.data.data
        }
      } catch (error) {
        console.error('獲取收藏清單失敗:', error)
        this.error = error.response?.data?.message || '獲取收藏清單失敗'
      } finally {
        this.isLoading = false
      }
    },

    // 添加到收藏清單
    async addItem(product) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        // 未登入時使用本地儲存
        if (!this.isInWishlist(product.id)) {
          this.items.push({
            ...product,
            addedAt: new Date().toISOString()
          })
        }
        return
      }

      if (this.isInWishlist(product.id)) return

      try {
        this.isLoading = true
        this.error = null

        const response = await api.post('/wishlist', {
          productId: product.id
        })

        if (response.data?.success) {
          // 重新獲取收藏清單
          await this.fetchWishlist()
        }
      } catch (error) {
        console.error('加入收藏失敗:', error)
        this.error = error.response?.data?.message || '加入收藏失敗'
      } finally {
        this.isLoading = false
      }
    },

    // 從收藏清單移除
    async removeItem(productId) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        // 未登入時使用本地儲存
        const index = this.items.findIndex(item => item.id === productId)
        if (index > -1) {
          this.items.splice(index, 1)
        }
        return
      }

      try {
        this.isLoading = true
        this.error = null

        const response = await api.delete(`/wishlist/${productId}`)

        if (response.data?.success) {
          // 從本地狀態移除
          const index = this.items.findIndex(item => item.id === productId)
          if (index > -1) {
            this.items.splice(index, 1)
          }
        }
      } catch (error) {
        console.error('移除收藏失敗:', error)
        this.error = error.response?.data?.message || '移除收藏失敗'
      } finally {
        this.isLoading = false
      }
    },

    // 清空收藏清單
    async clearAll() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        this.items = []
        return
      }

      try {
        this.isLoading = true
        this.error = null

        const response = await api.delete('/wishlist')

        if (response.data?.success) {
          this.items = []
        }
      } catch (error) {
        console.error('清空收藏清單失敗:', error)
        this.error = error.response?.data?.message || '清空收藏清單失敗'
      } finally {
        this.isLoading = false
      }
    },

    // 切換收藏狀態
    async toggleItem(product) {
      if (this.isInWishlist(product.id)) {
        await this.removeItem(product.id)
      } else {
        await this.addItem(product)
      }
    }
  },

  persist: {
    storage: localStorage,
    key: 'crystal-jewelry-wishlist'
  }
})

// 監聽用戶登入事件
if (typeof window !== 'undefined') {
  window.addEventListener('user-login', () => {
    const store = useWishlistStore()
    store.fetchWishlist()
  })
  
  window.addEventListener('user-logout', () => {
    const store = useWishlistStore()
    store.items = []
  })
}