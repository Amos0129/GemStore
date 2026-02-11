<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-8">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <router-link to="/" class="text-gray-500 hover:text-gray-700">首頁</router-link>
        </li>
        <li class="text-gray-300">/</li>
        <li>
          <router-link to="/products" class="text-gray-500 hover:text-gray-700">商品</router-link>
        </li>
        <li class="text-gray-300">/</li>
        <li class="text-gray-900 font-medium">{{ currentCategory?.name }}</li>
      </ol>
    </nav>

    <!-- Category Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ currentCategory?.name }}</h1>
      <p class="text-gray-600">{{ currentCategory?.description }}</p>
    </div>

    <!-- Filters & Sorting -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="flex items-center space-x-4">
        <select 
          v-model="filters.priceRange"
          class="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">所有價格</option>
          <option value="0-1000">NT$ 0 - 1,000</option>
          <option value="1000-3000">NT$ 1,000 - 3,000</option>
          <option value="3000-5000">NT$ 3,000 - 5,000</option>
          <option value="5000+">NT$ 5,000 以上</option>
        </select>

        <select 
          v-model="filters.material"
          class="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">所有材質</option>
          <option value="crystal">水晶</option>
          <option value="silver">銀</option>
          <option value="gold">金</option>
          <option value="gemstone">寶石</option>
        </select>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">排序：</span>
        <select 
          v-model="sortBy"
          class="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="default">預設</option>
          <option value="price-low">價格：低到高</option>
          <option value="price-high">價格：高到低</option>
          <option value="newest">最新商品</option>
          <option value="popular">最受歡迎</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- No Products -->
    <div v-else class="text-center py-16">
      <svg class="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">找不到符合條件的商品</h3>
      <p class="text-gray-500">請嘗試調整篩選條件或瀏覽其他分類</p>
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/store/products'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()

const currentPage = ref(1)
const pageSize = ref(12)
const sortBy = ref('default')
const filters = ref({
  priceRange: '',
  material: ''
})

const categories = ref([
  { id: 'necklaces', name: '項鍊', description: '精選天然水晶項鍊，展現優雅魅力' },
  { id: 'bracelets', name: '手鍊', description: '時尚水晶手鍊，為您的手腕增添光彩' },
  { id: 'earrings', name: '耳環', description: '精緻水晶耳環，點亮您的容顏' },
  { id: 'rings', name: '戒指', description: '獨特設計水晶戒指，彰顯個人品味' }
])

const currentCategory = computed(() => {
  return categories.value.find(cat => cat.id === route.params.category)
})

const filteredProducts = computed(() => {
  let products = productStore.products.filter(product => {
    return product.category === route.params.category
  })

  // Apply price filter
  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.includes('+') 
      ? [parseInt(filters.value.priceRange), Infinity]
      : filters.value.priceRange.split('-').map(Number)
    
    products = products.filter(product => {
      return product.price >= min && (max === Infinity || product.price <= max)
    })
  }

  // Apply material filter
  if (filters.value.material) {
    products = products.filter(product => {
      return product.material === filters.value.material
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
      products.sort((a, b) => b.sales - a.sales)
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

// Reset pagination when filters change
watch([filters, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>