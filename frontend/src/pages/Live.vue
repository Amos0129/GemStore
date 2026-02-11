<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Live Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-red-500 font-semibold">LIVE</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">晶礦飾品直播</h1>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{{ viewerCount }} 人觀看中</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Live Video Stream -->
        <div class="lg:col-span-3">
          <div class="bg-black rounded-lg overflow-hidden shadow-lg">
            <div class="aspect-video relative">
              <!-- Placeholder for live video -->
              <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                <div class="text-center text-white">
                  <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-xl font-semibold mb-2">直播即將開始</p>
                  <p class="text-sm opacity-75">今日晚上 8:00 開播</p>
                </div>
              </div>
              
              <!-- Live controls overlay -->
              <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div class="flex items-center space-x-3">
                  <button class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-2.828a9 9 0 010-12.728M6.343 6.343a9 9 0 000 12.728m2.828-2.828a5 5 0 000-7.072M12 12h.01"></path>
                    </svg>
                  </button>
                  <button class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-75 transition-colors">
                    全螢幕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Products in Live -->
          <div class="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">直播精選商品</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div 
                v-for="product in featuredProducts" 
                :key="product.id"
                class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                @click="addToCart(product)"
              >
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-purple-600">NT$ {{ product.price.toLocaleString() }}</span>
                  <button class="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Chat -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
            <!-- Chat Header -->
            <div class="p-4 border-b">
              <h3 class="font-semibold text-gray-900">即時聊天</h3>
              <p class="text-sm text-gray-600">{{ chatMessages.length }} 則訊息</p>
            </div>

            <!-- Chat Messages -->
            <div 
              ref="chatContainer"
              class="flex-1 overflow-y-auto p-4 space-y-3"
            >
              <div 
                v-for="message in chatMessages" 
                :key="message.id"
                class="flex items-start space-x-2"
              >
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-purple-600">{{ message.user.charAt(0) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{ message.user }}</span>
                    <span class="text-xs text-gray-500">{{ formatTime(message.time) }}</span>
                  </div>
                  <p class="text-sm text-gray-700 break-words">{{ message.text }}</p>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="p-4 border-t">
              <div class="flex space-x-2">
                <input
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="輸入訊息..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()

const viewerCount = ref(1234)
const newMessage = ref('')
const chatContainer = ref(null)

const featuredProducts = ref([
  {
    id: 1,
    name: '紫水晶項鍊',
    price: 1580,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    name: '玫瑰金手鍊',
    price: 2380,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    name: '鑽石耳環',
    price: 4580,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4,
    name: '藍寶石戒指',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  }
])

const chatMessages = ref([
  {
    id: 1,
    user: '晶礦小助手',
    text: '歡迎來到晶礦飾品直播間！',
    time: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    user: 'Crystal愛好者',
    text: '這個紫水晶項鍊好美！',
    time: new Date(Date.now() - 240000)
  },
  {
    id: 3,
    user: '珠寶達人',
    text: '請問有現貨嗎？',
    time: new Date(Date.now() - 180000)
  },
  {
    id: 4,
    user: '小美',
    text: '直播什麼時候開始？',
    time: new Date(Date.now() - 120000)
  },
  {
    id: 5,
    user: '晶礦小助手',
    text: '今晚8點準時開播，敬請期待！',
    time: new Date(Date.now() - 60000)
  }
])

let messageIdCounter = 6
let chatInterval = null

const formatTime = (time) => {
  return time.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  chatMessages.value.push({
    id: messageIdCounter++,
    user: '我',
    text: newMessage.value.trim(),
    time: new Date()
  })
  
  newMessage.value = ''
  
  // Auto scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    description: '直播特惠商品'
  })
}

const simulateChat = () => {
  const randomMessages = [
    '這個價格很划算！',
    '質量如何？',
    '有其他顏色嗎？',
    '運費多少？',
    '可以貨到付款嗎？',
    '好喜歡這個！',
    '已經下單了',
    '什麼時候發貨？',
    '有保固嗎？',
    '推薦給朋友了'
  ]
  
  const randomUsers = [
    '小花', '阿美', '珠珠', '晶晶', '小玉', 
    '水晶控', '飾品達人', '購物狂', '時尚女王', '優雅小姐'
  ]
  
  chatInterval = setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance to add message
      chatMessages.value.push({
        id: messageIdCounter++,
        user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        time: new Date()
      })
      
      // Keep only last 50 messages
      if (chatMessages.value.length > 50) {
        chatMessages.value = chatMessages.value.slice(-50)
      }
      
      // Auto scroll to bottom
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      })
    }
  }, 5000)
}

const updateViewerCount = () => {
  setInterval(() => {
    // Simulate viewer count changes
    const change = Math.floor(Math.random() * 20) - 10
    viewerCount.value = Math.max(1000, viewerCount.value + change)
  }, 10000)
}

onMounted(() => {
  simulateChat()
  updateViewerCount()
  
  // Auto scroll chat to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})

onUnmounted(() => {
  if (chatInterval) {
    clearInterval(chatInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>