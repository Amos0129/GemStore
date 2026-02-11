<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">我的收藏</h2>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600">共 {{ wishlistStore.items.length }} 件商品</span>
        <button
          v-if="wishlistStore.items.length > 0"
          @click="clearAllWishlist"
          class="text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          清空收藏
        </button>
      </div>
    </div>

    <div v-if="wishlistStore.items.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">暫無收藏商品</h3>
      <p class="text-gray-500 mb-4">瀏覽商品時點擊愛心即可收藏</p>
      <router-link
        to="/products"
        class="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        去逛逛
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in wishlistStore.items"
        :key="item.id"
        class="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <!-- Product Image -->
        <div class="aspect-square bg-white">
          <router-link :to="`/product/${item.id}`">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </router-link>
        </div>

        <!-- Remove from Wishlist -->
        <button
          @click="removeFromWishlist(item.id)"
          class="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-colors shadow-sm"
          title="移除收藏"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>

        <!-- Stock Badge -->
        <div v-if="item.stock === 0" class="absolute top-3 left-3">
          <span class="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            缺貨
          </span>
        </div>
        <div v-else-if="item.stock < 5" class="absolute top-3 left-3">
          <span class="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
            僅剩 {{ item.stock }} 件
          </span>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <router-link :to="`/product/${item.id}`" class="block hover:text-purple-600 transition-colors">
            <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">{{ item.name }}</h3>
          </router-link>
          
          <div class="flex items-center space-x-2 mb-3">
            <span class="text-lg font-bold text-purple-600">NT$ {{ item.price.toLocaleString() }}</span>
            <span v-if="item.originalPrice" class="text-sm text-gray-500 line-through">
              NT$ {{ item.originalPrice.toLocaleString() }}
            </span>
            <span v-if="item.discount" class="bg-red-100 text-red-600 text-xs px-1 py-0.5 rounded">
              -{{ item.discount }}%
            </span>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="flex text-yellow-400 mr-1">
                <svg v-for="i in 5" :key="i" :class="['w-3 h-3', i <= item.rating ? 'fill-current' : 'fill-gray-200']" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-xs text-gray-600">({{ item.reviews }})</span>
            </div>
            <span class="text-xs text-gray-500">已售 {{ item.sold }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              @click="addToCart(item)"
              :disabled="item.stock === 0"
              class="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ item.stock === 0 ? '缺貨' : '加入購物車' }}
            </button>
            <button
              @click="buyNow(item)"
              :disabled="item.stock === 0"
              class="flex-1 border border-purple-600 text-purple-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              立即購買
            </button>
          </div>
        </div>

        <!-- Recently Added Badge -->
        <div v-if="isRecentlyAdded(item.addedAt)" class="absolute bottom-4 left-4">
          <span class="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            新收藏
          </span>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div v-if="recommendedItems.length > 0" class="mt-12 pt-8 border-t">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">為您推薦</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="item in recommendedItems"
          :key="item.id"
          class="group cursor-pointer"
          @click="$router.push(`/product/${item.id}`)"
        >
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h4 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{{ item.name }}</h4>
          <p class="text-sm font-bold text-purple-600">NT$ {{ item.price.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { useProductStore } from '@/store/products'

const router = useRouter()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const productStore = useProductStore()

const recommendedItems = computed(() => {
  // Get products similar to wishlist items
  const categories = [...new Set(wishlistStore.items.map(item => item.category))]
  return productStore.products
    .filter(product => 
      categories.includes(product.category) && 
      !wishlistStore.items.some(wishItem => wishItem.id === product.id)
    )
    .slice(0, 4)
})

const isRecentlyAdded = (addedAt) => {
  if (!addedAt) return false
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  return new Date(addedAt) > threeDaysAgo
}

const removeFromWishlist = (productId) => {
  wishlistStore.removeItem(productId)
}

const clearAllWishlist = () => {
  if (confirm('確定要清空所有收藏商品嗎？')) {
    wishlistStore.clearAll()
  }
}

const addToCart = (item) => {
  if (item.stock === 0) return
  
  cartStore.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    description: item.description || '收藏商品'
  })
  
  // Optional: Remove from wishlist after adding to cart
  // wishlistStore.removeItem(item.id)
}

const buyNow = (item) => {
  if (item.stock === 0) return
  
  addToCart(item)
  router.push('/checkout')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>