<template>
  <section class="newsletter-section">
    <div class="container">
      <div class="newsletter-card">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h2 class="newsletter-title">
              訂閱我們的電子報
            </h2>
            <p class="newsletter-subtitle">
              獲得最新商品資訊、專屬優惠與水晶知識分享
            </p>
          </div>
          
          <form class="newsletter-form" @submit.prevent="handleSubscribe">
            <div class="input-group">
              <input 
                type="email" 
                placeholder="輸入您的電子信箱"
                v-model="email"
                class="email-input"
                required
              />
              <button 
                type="submit" 
                class="subscribe-btn"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">訂閱</span>
                <span v-else class="flex items-center">
                  <i class="fas fa-spinner animate-spin mr-2"></i>
                  處理中...
                </span>
              </button>
            </div>
            
            <div class="newsletter-benefits">
              <div class="benefit">
                <i class="fas fa-gift"></i>
                <span>專屬優惠券</span>
              </div>
              <div class="benefit">
                <i class="fas fa-bell"></i>
                <span>新品通知</span>
              </div>
              <div class="benefit">
                <i class="fas fa-star"></i>
                <span>水晶知識</span>
              </div>
            </div>
          </form>
        </div>
        
        <div class="newsletter-image">
          <div class="crystal-animation">
            <i class="fas fa-gem"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const email = ref('')
const isSubmitting = ref(false)

const handleSubscribe = async () => {
  isSubmitting.value = true
  
  try {
    // TODO: 實現實際的訂閱功能
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模擬 API 請求
    
    showToast('感謝您的訂閱！歡迎優惠券已發送至您的信箱', 'success')
    email.value = ''
  } catch (error) {
    showToast('訂閱失敗，請稍後再試', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.newsletter-section {
  @apply py-20 bg-gradient-to-r from-background-primary to-background-secondary;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.newsletter-card {
  @apply bg-background-card border border-accent-blue/30 rounded-3xl p-8 lg:p-12 backdrop-blur-sm shadow-glow flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12;
}

.newsletter-content {
  @apply flex-1;
}

.newsletter-text {
  @apply mb-8;
}

.newsletter-title {
  @apply text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent mb-4;
}

.newsletter-subtitle {
  @apply text-gray-300 text-lg;
}

.newsletter-form {
  @apply space-y-6;
}

.input-group {
  @apply flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3;
}

.email-input {
  @apply flex-1 px-6 py-4 bg-background-primary border border-accent-blue/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-300;
}

.subscribe-btn {
  @apply px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-cyan text-background-primary font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

.newsletter-benefits {
  @apply flex flex-wrap gap-4 justify-center sm:justify-start;
}

.benefit {
  @apply flex items-center space-x-2 text-gray-300 text-sm;
}

.benefit i {
  @apply text-accent-blue;
}

.newsletter-image {
  @apply flex-shrink-0 lg:w-64;
}

.crystal-animation {
  @apply w-32 h-32 mx-auto bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 rounded-full flex items-center justify-center text-6xl text-accent-blue;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Mobile adjustments */
@media (max-width: 1024px) {
  .newsletter-card {
    @apply text-center;
  }
  
  .newsletter-title {
    @apply text-2xl lg:text-3xl;
  }
}
</style>