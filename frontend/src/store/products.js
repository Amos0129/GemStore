import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export const useProductStore = defineStore('products', () => {
  // 狀態
  const products = ref([])
  const categories = ref([])
  const currentProduct = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
    category: '',
    priceRange: [0, 10000],
    searchQuery: '',
    sortBy: 'newest'
  })

  // 計算屬性
  const filteredProducts = computed(() => {
    let result = [...products.value]

    // 分類篩選
    if (filters.value.category) {
      result = result.filter(p => p.category === filters.value.category)
    }

    // 價格篩選
    result = result.filter(p => 
      p.price >= filters.value.priceRange[0] && 
      p.price <= filters.value.priceRange[1]
    )

    // 搜尋篩選
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }

    // 排序
    switch (filters.value.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.sales - a.sales)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    return result
  })

  const featuredProducts = computed(() => 
    products.value.filter(p => p.featured).slice(0, 4)
  )

  const newProducts = computed(() =>
    products.value
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
  )

  const saleProducts = computed(() =>
    products.value.filter(p => p.originalPrice > p.price).slice(0, 8)
  )

  // 取得所有商品
  const fetchProducts = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.get('/products')
      // API 響應格式可能是 {success: true, data: [...]}
      products.value = response.data?.data || response.data || []
      
    } catch (err) {
      error.value = err.response?.data?.message || '取得商品失敗'
      console.error('Failed to fetch products:', err)
      products.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 取得單一商品
  const fetchProduct = async (id) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.get(`/products/${id}`)
      currentProduct.value = response.data
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '取得商品失敗'
      console.error('Failed to fetch product:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 取得商品分類
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      categories.value = response.data?.data || response.data || []
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      categories.value = []
    }
  }

  // 搜尋商品
  const searchProducts = async (query) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '搜尋失敗'
      console.error('Failed to search products:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // 取得分類商品
  const fetchProductsByCategory = async (categorySlug) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.get(`/products/category/${categorySlug}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '取得分類商品失敗'
      console.error('Failed to fetch products by category:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // 設定篩選條件
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // 重設篩選條件
  const resetFilters = () => {
    filters.value = {
      category: '',
      priceRange: [0, 10000],
      searchQuery: '',
      sortBy: 'newest'
    }
  }

  return {
    // 狀態
    products,
    categories,
    currentProduct,
    isLoading,
    error,
    filters,
    
    // 計算屬性
    filteredProducts,
    featuredProducts,
    newProducts,
    saleProducts,
    
    // 方法
    fetchProducts,
    fetchProduct,
    fetchCategories,
    searchProducts,
    fetchProductsByCategory,
    setFilters,
    resetFilters
  }
})