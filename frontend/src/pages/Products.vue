<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">所有商品</h1>
      <p class="text-gray-600">探索我們精選的天然水晶飾品系列</p>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">搜尋</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="搜尋商品..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <!-- Category -->
        <div class="md:col-span-1">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">分類</label>
          <select
            id="category"
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">所有分類</option>
            <option value="necklaces">項鍊</option>
            <option value="bracelets">手鍊</option>
            <option value="earrings">耳環</option>
            <option value="rings">戒指</option>
          </select>
        </div>

        <!-- Price Range -->
        <div class="md:col-span-1">
          <label for="priceRange" class="block text-sm font-medium text-gray-700 mb-1">價格</label>
          <select
            id="priceRange"
            v-model="filters.priceRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">所有價格</option>
            <option value="0-1000">NT$ 0 - 1,000</option>
            <option value="1000-3000">NT$ 1,000 - 3,000</option>
            <option value="3000-5000">NT$ 3,000 - 5,000</option>
            <option value="5000+">NT$ 5,000 以上</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="md:col-span-1">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">排序</label>
          <select
            id="sort"
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="default">預設排序</option>
            <option value="price-low">價格：低到高</option>
            <option value="price-high">價格：高到低</option>
            <option value="newest">最新商品</option>
            <option value="popular">最受歡迎</option>
            <option value="rating">評價最高</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-between items-center">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <span>顯示 {{ filteredProducts.length }} 個結果</span>
          <span v-if="hasActiveFilters">·</span>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-purple-600 hover:text-purple-700 font-medium"
          >
            清除篩選
          </button>
        </div>

        <!-- View Toggle (Hidden on Mobile) -->
        <div class="hidden sm:flex items-center space-x-2">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-md',
              viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-2 rounded-md',
              viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Products -->
    <div v-if="paginatedProducts.length > 0">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="products-grid-page mb-8">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- List View (Hidden on mobile) -->
      <div v-else class="space-y-6 mb-8 hidden sm:block">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <div class="flex items-center space-x-6">
            <router-link :to="`/product/${product.id}`" class="flex-shrink-0">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-32 h-32 object-cover rounded-lg"
              />
            </router-link>
            
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-2">
                <router-link :to="`/product/${product.id}`" class="hover:text-purple-600">
                  <h3 class="text-xl font-semibold text-gray-900">{{ product.name }}</h3>
                </router-link>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-purple-600">NT$ {{ product.price.toLocaleString() }}</span>
                  <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
                    NT$ {{ product.originalPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <svg v-for="i in 5" :key="i" :class="['w-4 h-4', i <= product.rating ? 'fill-current' : 'fill-gray-200']" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="ml-1 text-sm text-gray-600">{{ product.rating }} ({{ product.reviews }})</span>
                  </div>
                  <span class="text-sm text-gray-500">已售 {{ product.sold }} 件</span>
                </div>
                
                <div class="flex items-center space-x-3">
                  <button
                    @click="toggleWishlist(product)"
                    :class="[
                      'p-2 rounded-full transition-colors',
                      wishlistStore.isInWishlist(product.id)
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    ]"
                  >
                    <svg class="w-5 h-5" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="addToCart(product)"
                    class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    <!-- No Products -->
    <div v-else class="text-center py-16">
      <svg class="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">找不到符合條件的商品</h3>
      <p class="text-gray-500 mb-4">請嘗試調整篩選條件或清除篩選</p>
      <button
        @click="clearFilters"
        class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
      >
        清除篩選
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProductStore } from '@/store/products'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import ProductCard from '@/components/product/ProductCard.vue'

const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const sortBy = ref('default')

const filters = ref({
  search: '',
  category: '',
  priceRange: ''
})

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.category || filters.value.priceRange || sortBy.value !== 'default'
})

const filteredProducts = computed(() => {
  let products = [...productStore.products]

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    products = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )
  }

  // Apply category filter
  if (filters.value.category) {
    products = products.filter(product => product.category === filters.value.category)
  }

  // Apply price filter
  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.includes('+') 
      ? [parseInt(filters.value.priceRange), Infinity]
      : filters.value.priceRange.split('-').map(Number)
    
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
    case 'popular':
      products.sort((a, b) => b.sold - a.sold)
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
  }

  return products
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value)
})

const paginatedProducts = computed(() => {
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

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    priceRange: ''
  }
  sortBy.value = 'default'
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description.substring(0, 100) + '...'
  })
}

const toggleWishlist = (product) => {
  if (wishlistStore.isInWishlist(product.id)) {
    wishlistStore.removeItem(product.id)
  } else {
    wishlistStore.addItem(product)
  }
}

// Reset pagination when filters change
watch([filters, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Products Grid for main products page */
.products-grid-page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .products-grid-page {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid-page {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .products-grid-page {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Mobile horizontal scroll for products page */
@media (max-width: 767px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .products-grid-page {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding-left: 16px;
    padding-right: 16px;
    margin-left: -8px;
    margin-right: -8px;
  }
  
  .products-grid-page::-webkit-scrollbar {
    height: 4px;
    margin-top: 8px;
  }
  
  .products-grid-page::-webkit-scrollbar-track {
    background: rgba(196, 181, 253, 0.15);
    border-radius: 2px;
  }
  
  .products-grid-page::-webkit-scrollbar-thumb {
    background: #C4B5FD;
    border-radius: 2px;
  }
  
  .products-grid-page::-webkit-scrollbar-thumb:hover {
    background: #8B5CF6;
  }

  /* Update page header for mobile */
  .mb-8 h1 {
    font-size: 1.5rem;
  }

  /* Simplify filters on mobile */
  .bg-white.rounded-lg.shadow-sm.border.p-6 {
    padding: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .grid.grid-cols-1.md\\:grid-cols-4.gap-4 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  /* Hide list view on mobile since we force grid+horizontal scroll */
  .space-y-6 {
    display: none;
  }
}

@media (max-width: 480px) {
  .container {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  
  .bg-white.rounded-lg.shadow-sm.border.p-6 {
    padding: 0.75rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
}
</style>