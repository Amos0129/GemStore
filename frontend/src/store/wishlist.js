import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),

  getters: {
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    },

    itemCount: (state) => state.items.length
  },

  actions: {
    addItem(product) {
      if (!this.isInWishlist(product.id)) {
        this.items.push({
          ...product,
          addedAt: new Date().toISOString()
        })
      }
    },

    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    clearAll() {
      this.items = []
    },

    toggleItem(product) {
      if (this.isInWishlist(product.id)) {
        this.removeItem(product.id)
      } else {
        this.addItem(product)
      }
    }
  },

  persist: {
    storage: localStorage,
    key: 'crystal-jewelry-wishlist'
  }
})