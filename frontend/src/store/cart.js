import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 狀態
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const isOpen = ref(false)

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

  // 添加商品到購物車
  const addItem = (product) => {
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

  // 移除商品
  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  // 更新數量
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  // 清空購物車
  const clearCart = () => {
    items.value = []
    saveToStorage()
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
    
    // 計算屬性
    totalItems,
    totalPrice,
    isEmpty,
    
    // 方法
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
})