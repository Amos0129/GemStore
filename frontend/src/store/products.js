import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export const useProductStore = defineStore('products', () => {
  // 模擬商品數據
  const mockProducts = [
    {
      id: 1,
      name: '紫水晶能量項鍊',
      category: 'necklace',
      price: 2800,
      originalPrice: 3200,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      description: '高品質紫水晶製成，能夠帶來平靜與智慧的能量，適合冥想與提升直覺力',
      featured: true,
      sales: 156,
      badge: 'sale',
      createdAt: '2024-02-01T10:00:00Z'
    },
    {
      id: 2,
      name: '粉晶愛情手鍊',
      category: 'bracelet',
      price: 1680,
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
      description: '溫柔的粉晶能夠招來愛情，提升人際關係，帶來內心的平和與溫暖',
      featured: true,
      sales: 203,
      badge: 'hot',
      createdAt: '2024-02-05T14:30:00Z'
    },
    {
      id: 3,
      name: '白水晶淨化戒指',
      category: 'ring',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
      description: '純淨的白水晶能夠淨化負能量，帶來清明的思緒與心靈的平靜',
      featured: false,
      sales: 89,
      createdAt: '2024-02-03T09:15:00Z'
    },
    {
      id: 4,
      name: '黃水晶財運耳環',
      category: 'earring',
      price: 1800,
      originalPrice: 2200,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
      description: '黃水晶能夠招財進寶，提升自信心與創造力，是商務人士的最佳選擇',
      featured: true,
      sales: 127,
      badge: 'sale',
      createdAt: '2024-02-07T16:45:00Z'
    },
    {
      id: 5,
      name: '綠髮晶招財手鍊',
      category: 'bracelet',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
      description: '綠髮晶具有強大的招財能力，能夠提升事業運勢與財富機會',
      featured: true,
      sales: 95,
      createdAt: '2024-02-06T11:20:00Z'
    },
    {
      id: 6,
      name: '月光石直覺項鍊',
      category: 'necklace',
      price: 3600,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      description: '月光石能夠增強直覺力與靈性感知，幫助女性平衡內分泌系統',
      featured: false,
      sales: 67,
      createdAt: '2024-02-02T13:10:00Z'
    },
    {
      id: 7,
      name: '黑曜石保護戒指',
      category: 'ring',
      price: 2200,
      originalPrice: 2600,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
      description: '黑曜石具有強大的保護能力，能夠阻擋負面能量與邪氣入侵',
      featured: false,
      sales: 134,
      createdAt: '2024-02-08T08:30:00Z'
    },
    {
      id: 8,
      name: '海藍寶溝通耳環',
      category: 'earring',
      price: 2900,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      description: '海藍寶能夠提升溝通能力與表達技巧，增進人際關係的和諧',
      featured: false,
      sales: 78,
      createdAt: '2024-02-04T15:45:00Z'
    },
    {
      id: 9,
      name: '紅瑪瑙活力手鍊',
      category: 'bracelet',
      price: 1450,
      originalPrice: 1650,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      description: '紅瑪瑙能夠提升活力與勇氣，增強身體健康與生命力',
      featured: false,
      sales: 189,
      badge: 'new',
      createdAt: '2024-02-09T12:00:00Z'
    },
    {
      id: 10,
      name: '虎眼石自信項鍊',
      category: 'necklace',
      price: 2600,
      image: 'https://images.unsplash.com/photo-1596944924615-b9bdc0c94cee?w=400',
      description: '虎眼石能夠增強自信心與決策能力，幫助達成目標與理想',
      featured: false,
      sales: 112,
      createdAt: '2024-02-01T17:20:00Z'
    }
  ]

  // 模擬分類數據
  const mockCategories = [
    {
      id: 1,
      name: '項鍊',
      slug: 'necklace',
      icon: 'fas fa-gem',
      count: 15
    },
    {
      id: 2,
      name: '手鍊',
      slug: 'bracelet', 
      icon: 'fas fa-circle-dot',
      count: 12
    },
    {
      id: 3,
      name: '戒指',
      slug: 'ring',
      icon: 'fas fa-ring',
      count: 8
    },
    {
      id: 4,
      name: '耳飾',
      slug: 'earring',
      icon: 'fas fa-star',
      count: 6
    },
    {
      id: 5,
      name: '吊墜',
      slug: 'pendant',
      icon: 'fas fa-diamond',
      count: 9
    }
  ]

  // 狀態
  const products = ref([...mockProducts])
  const categories = ref([...mockCategories])
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
      
      // 先嘗試從 API 獲取，失敗則使用模擬數據
      try {
        const response = await api.get('/products')
        if (response.data && response.data.length > 0) {
          products.value = response.data
        } else {
          // API 返回空數據，使用模擬數據
          products.value = [...mockProducts]
        }
      } catch (apiError) {
        // API 失敗，使用模擬數據
        console.log('API unavailable, using mock data')
        products.value = [...mockProducts]
      }
    } catch (err) {
      error.value = err.response?.data?.message || '取得商品失敗'
      console.error('Failed to fetch products:', err)
      // 即使出錯也使用模擬數據
      products.value = [...mockProducts]
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
      categories.value = response.data
    } catch (err) {
      console.error('Failed to fetch categories:', err)
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