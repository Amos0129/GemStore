<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        <span v-if="searchQuery">「{{ searchQuery }}」的搜尋結果</span>
        <span v-else>商品搜尋</span>
      </h1>
      <p v-if="searchQuery" class="text-gray-600">
        找到 {{ filteredProducts.length }} 個結果
      </p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="flex space-x-4">
        <div class="flex-1">
          <input
            v-model="searchInput"
            @keyup.enter="performSearch"
            type="text"
            placeholder="搜尋商品..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <button
          @click="performSearch"
          class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          搜尋
        </button>
      </div>

      <!-- Search Suggestions -->
      <div v-if="searchSuggestions.length > 0 && !searchQuery" class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">熱門搜尋</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="searchFromSuggestion(suggestion)"
            class="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery">
      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="relevance">相關性</option>
          <option value="price-low">價格：低到高</option>
          <option value="price-high">價格：高到低</option>
          <option value="newest">最新商品</option>
          <option value="rating">評價最高</option>
        </select>

        <select
          v-model="categoryFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">所有分類</option>
          <option value="necklaces">項鍊</option>
          <option value="bracelets">手鍊</option>
          <option value="earrings">耳環</option>
          <option value="rings">戒指</option>
        </select>

        <select
          v-model="priceFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">所有價格</option>
          <option value="0-1000">NT$ 0 - 1,000</option>
          <option value="1000-3000">NT$ 1,000 - 3,000</option>
          <option value="3000-5000">NT$ 3,000 - 5,000</option>
          <option value="5000+">NT$ 5,000 以上</option>
        </select>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          清除篩選
        </button>
      </div>

      <!-- Results -->
      <div v-if="paginatedResults.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <ProductCard
            v-for="product in paginatedResults"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一頁
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:text-purple-600'
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一頁
            </button>
          </nav>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">找不到相關商品</h3>
        <p class="text-gray-500 mb-6">請嘗試不同的關鍵字或調整篩選條件</p>
        
        <!-- Search Suggestions -->
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-3">您可能想要搜尋：</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              @click="searchFromSuggestion(suggestion)"
              class="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <router-link
          to="/products"
          class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          瀏覽所有商品
        </router-link>
      </div>
    </div>

    <!-- No Search Query -->
    <div v-else class="text-center py-16">
      <svg class="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">開始搜尋商品</h3>
      <p class="text-gray-500">輸入關鍵字找到您想要的商品</p>
    </div>

    <!-- Recent Searches -->
    <div v-if="recentSearches.length > 0" class="mt-12">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">最近搜尋</h3>
          <button
            @click="clearRecentSearches"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            清除
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="search in recentSearches"
            :key="search"
            @click="searchFromSuggestion(search)"
            class="flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ search }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/store/products'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const searchInput = ref('')
const searchQuery = ref('')
const sortBy = ref('relevance')
const categoryFilter = ref('')
const priceFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

const recentSearches = ref(['紫水晶', '項鍊', '手鍊', '耳環'])

const searchSuggestions = ref([
  '紫水晶項鍊',
  '玫瑰金手鍊',
  '鑽石耳環',
  '藍寶石戒指',
  '天然水晶',
  '925純銀',
  '生日禮物',
  '情人節禮品'
])

const hasActiveFilters = computed(() => {
  return sortBy.value !== 'relevance' || categoryFilter.value || priceFilter.value
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return []
  
  let products = productStore.products.filter(product => {
    const query = searchQuery.value.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })

  // Apply category filter
  if (categoryFilter.value) {
    products = products.filter(product => product.category === categoryFilter.value)
  }

  // Apply price filter
  if (priceFilter.value) {
    const [min, max] = priceFilter.value.includes('+')
      ? [parseInt(priceFilter.value), Infinity]
      : priceFilter.value.split('-').map(Number)
    
    products = products.filter(product => {
      return product.price >= min && (max === Infinity || product.price <= max)
    })
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      products.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
    case 'relevance':
    default:
      // Sort by relevance (how well the search query matches)
      products.sort((a, b) => {
        const aRelevance = getRelevanceScore(a, searchQuery.value)
        const bRelevance = getRelevanceScore(b, searchQuery.value)
        return bRelevance - aRelevance
      })
      break
  }

  return products
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value)
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2

  let pages = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

const getRelevanceScore = (product, query) => {
  const lowerQuery = query.toLowerCase()
  const lowerName = product.name.toLowerCase()
  const lowerDescription = product.description.toLowerCase()
  
  let score = 0
  
  // Exact name match gets highest score
  if (lowerName === lowerQuery) score += 100
  // Name starts with query
  else if (lowerName.startsWith(lowerQuery)) score += 50
  // Name contains query
  else if (lowerName.includes(lowerQuery)) score += 25
  
  // Description contains query
  if (lowerDescription.includes(lowerQuery)) score += 10
  
  // Category matches
  if (product.category.toLowerCase().includes(lowerQuery)) score += 15
  
  return score
}

const performSearch = () => {
  if (!searchInput.value.trim()) return
  
  searchQuery.value = searchInput.value.trim()
  currentPage.value = 1
  
  // Add to recent searches
  if (!recentSearches.value.includes(searchQuery.value)) {
    recentSearches.value.unshift(searchQuery.value)
    if (recentSearches.value.length > 8) {
      recentSearches.value = recentSearches.value.slice(0, 8)
    }
  }
  
  // Update URL
  router.push({ query: { q: searchQuery.value } })
}

const searchFromSuggestion = (suggestion) => {
  searchInput.value = suggestion
  performSearch()
}

const clearFilters = () => {
  sortBy.value = 'relevance'
  categoryFilter.value = ''
  priceFilter.value = ''
  currentPage.value = 1
}

const clearRecentSearches = () => {
  recentSearches.value = []
}

// Reset pagination when filters change
watch([sortBy, categoryFilter, priceFilter], () => {
  currentPage.value = 1
})

// Load search query from URL
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
    searchInput.value = route.query.q
  }
  
  productStore.fetchProducts()
})

// Watch for route changes
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery
      searchInput.value = newQuery
    } else {
      searchQuery.value = ''
      searchInput.value = ''
    }
  }
)
</script>

<style scoped>
/* Additional styles if needed */
</style>