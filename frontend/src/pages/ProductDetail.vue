<template>
  <div v-if="product" class="container mx-auto px-4 py-8">
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
        <li>
          <router-link :to="`/category/${product.category}`" class="text-gray-500 hover:text-gray-700">
            {{ getCategoryName(product.category) }}
          </router-link>
        </li>
        <li class="text-gray-300">/</li>
        <li class="text-gray-900 font-medium">{{ product.name }}</li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
      <!-- Product Images -->
      <div>
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            :src="selectedImage"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Thumbnail Images -->
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="selectedImage = image"
            :class="[
              'aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors',
              selectedImage === image ? 'border-purple-600' : 'border-transparent hover:border-gray-300'
            ]"
          >
            <img
              :src="image"
              :alt="`${product.name} ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" :class="['w-5 h-5', i <= product.rating ? 'fill-current' : 'fill-gray-200']" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600">{{ product.rating }} ({{ product.reviews }} 評價)</span>
            </div>
            <span class="text-sm text-gray-500">|</span>
            <span class="text-sm text-gray-600">已售出 {{ product.sold }} 件</span>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center space-x-4">
              <span class="text-3xl font-bold text-purple-600">NT$ {{ product.price.toLocaleString() }}</span>
              <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
                NT$ {{ product.originalPrice.toLocaleString() }}
              </span>
              <span v-if="product.discount" class="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                {{ product.discount }}% OFF
              </span>
            </div>
          </div>
        </div>

        <!-- Product Options -->
        <div class="space-y-6 mb-8">
          <!-- Color Selection -->
          <div v-if="product.colors">
            <h3 class="text-sm font-medium text-gray-900 mb-3">顏色</h3>
            <div class="flex space-x-3">
              <button
                v-for="color in product.colors"
                :key="color.name"
                @click="selectedColor = color"
                :class="[
                  'w-8 h-8 rounded-full border-2 transition-colors',
                  selectedColor?.name === color.name ? 'border-purple-600' : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Size Selection -->
          <div v-if="product.sizes">
            <h3 class="text-sm font-medium text-gray-900 mb-3">尺寸</h3>
            <div class="flex space-x-3">
              <button
                v-for="size in product.sizes"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'px-4 py-2 border rounded-md text-sm font-medium transition-colors',
                  selectedSize === size 
                    ? 'border-purple-600 text-purple-600 bg-purple-50' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-3">數量</h3>
            <div class="flex items-center space-x-3">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span class="text-gray-600">-</span>
              </button>
              <span class="w-12 text-center font-semibold">{{ quantity }}</span>
              <button
                @click="quantity = Math.min(product.stock, quantity + 1)"
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span class="text-gray-600">+</span>
              </button>
              <span class="text-sm text-gray-500">庫存 {{ product.stock }} 件</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4 mb-8">
          <button
            @click="addToCart"
            class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            加入購物車
          </button>
          <button
            @click="buyNow"
            class="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            立即購買
          </button>
          <button
            @click="toggleWishlist"
            :class="[
              'p-3 border rounded-lg transition-colors',
              isInWishlist ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'
            ]"
          >
            <svg class="w-6 h-6" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>

        <!-- Product Features -->
        <div class="border-t pt-6">
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              免費配送（訂單滿 NT$ 1,000）
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              7 天鑑賞期
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              一年品質保證
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              天然水晶認證
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Product Details Tabs -->
    <div class="mb-12">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="mt-6">
        <!-- Description Tab -->
        <div v-if="activeTab === 'description'" class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          <div class="mt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">商品特色</h4>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- Specifications Tab -->
        <div v-if="activeTab === 'specifications'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">商品規格</h4>
            <dl class="space-y-2">
              <div v-for="(value, key) in product.specifications" :key="key" class="flex">
                <dt class="text-sm text-gray-600 w-24">{{ key }}：</dt>
                <dd class="text-sm text-gray-900">{{ value }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'">
          <div class="mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">{{ product.rating }}</span>
                <div class="ml-2 flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" :class="['w-5 h-5', i <= product.rating ? 'fill-current' : 'fill-gray-200']" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              <span class="text-gray-600">基於 {{ product.reviews }} 則評價</span>
            </div>
          </div>

          <!-- Sample Reviews -->
          <div class="space-y-6">
            <div v-for="review in sampleReviews" :key="review.id" class="border-b pb-6">
              <div class="flex items-center space-x-4 mb-2">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">{{ review.user.charAt(0) }}</span>
                </div>
                <div>
                  <h5 class="font-medium text-gray-900">{{ review.user }}</h5>
                  <div class="flex items-center space-x-2">
                    <div class="flex text-yellow-400">
                      <svg v-for="i in 5" :key="i" :class="['w-4 h-4', i <= review.rating ? 'fill-current' : 'fill-gray-200']" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                  </div>
                </div>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">相關商品</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="container mx-auto px-4 py-16">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p class="text-gray-600">載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useProductStore } from '@/store/products'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()

const product = ref(null)
const selectedImage = ref('')
const selectedColor = ref(null)
const selectedSize = ref('')
const quantity = ref(1)
const activeTab = ref('description')

const tabs = [
  { id: 'description', name: '商品描述' },
  { id: 'specifications', name: '商品規格' },
  { id: 'reviews', name: '商品評價' }
]

const sampleReviews = ref([
  {
    id: 1,
    user: '小美',
    rating: 5,
    date: '2024/01/15',
    comment: '非常漂亮的項鍊，質感很好，包裝也很精美。收到後非常滿意！'
  },
  {
    id: 2,
    user: '晶晶',
    rating: 4,
    date: '2024/01/10',
    comment: '顏色很美，但比想像中小一點。整體還是很喜歡的。'
  },
  {
    id: 3,
    user: '水晶愛好者',
    rating: 5,
    date: '2024/01/08',
    comment: '第二次購買了，品質穩定，會繼續支持！'
  }
])

const relatedProducts = computed(() => {
  return productStore.products
    .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4)
})

const isInWishlist = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false
})

const getCategoryName = (categoryId) => {
  const categories = {
    'necklaces': '項鍊',
    'bracelets': '手鍊',
    'earrings': '耳環',
    'rings': '戒指'
  }
  return categories[categoryId] || categoryId
}

const addToCart = () => {
  if (!product.value) return
  
  const item = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: selectedImage.value,
    description: product.value.description.substring(0, 100) + '...'
  }
  
  cartStore.addItem(item, quantity.value)
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
}

const toggleWishlist = () => {
  if (!product.value) return
  
  if (isInWishlist.value) {
    wishlistStore.removeItem(product.value.id)
  } else {
    wishlistStore.addItem(product.value)
  }
}

onMounted(async () => {
  try {
    await productStore.fetchProducts()
    
    // Mock product data for demo
    product.value = {
      id: parseInt(route.params.id),
      name: '紫水晶優雅項鍊',
      price: 2580,
      originalPrice: 3200,
      discount: 20,
      rating: 4.8,
      reviews: 127,
      sold: 89,
      stock: 15,
      description: '這款紫水晶項鍊採用AAA級天然紫水晶，色澤純正，透明度極佳。搭配925純銀鏈條，設計優雅簡約，適合日常佩戴或特殊場合。紫水晶被譽為智慧之石，能夠增強直覺力和精神力量，是送禮自用的絕佳選擇。',
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: '深紫', value: '#6B46C1' },
        { name: '淺紫', value: '#A78BFA' },
        { name: '粉紫', value: '#DDD6FE' }
      ],
      sizes: ['40cm', '45cm', '50cm'],
      category: 'necklaces',
      features: [
        'AAA級天然紫水晶',
        '925純銀鏈條',
        '手工切割工藝',
        '防過敏處理',
        '附精美包裝盒',
        '一年品質保證'
      ],
      specifications: {
        '材質': '天然紫水晶 + 925純銀',
        '水晶尺寸': '8mm x 12mm',
        '鏈長': '可選 40/45/50cm',
        '重量': '約15g',
        '產地': '巴西',
        '工藝': '手工切割拋光'
      }
    }
    
    selectedImage.value = product.value.images[0]
    if (product.value.colors) {
      selectedColor.value = product.value.colors[0]
    }
    if (product.value.sizes) {
      selectedSize.value = product.value.sizes[1]
    }
  } catch (error) {
    console.error('Failed to load product:', error)
  }
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  margin: 1rem 0;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>