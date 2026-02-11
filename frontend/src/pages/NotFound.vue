<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="error-illustration">
          <i class="fas fa-search"></i>
          <div class="error-number">404</div>
        </div>
        
        <h1 class="error-title">頁面不存在</h1>
        <p class="error-description">
          很抱歉，您要尋找的頁面可能已被移動或刪除。
        </p>
        
        <div class="error-actions">
          <router-link to="/" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block">
            <i class="fas fa-home mr-2"></i>
            回到首頁
          </router-link>
          <button @click="goBack" class="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            返回上頁
          </button>
        </div>
        
        <div class="suggested-links">
          <h3>您可能想要：</h3>
          <ul>
            <li>
              <router-link to="/products">
                <i class="fas fa-gem mr-2"></i>
                瀏覽所有商品
              </router-link>
            </li>
            <li>
              <router-link to="/categories">
                <i class="fas fa-list mr-2"></i>
                查看商品分類
              </router-link>
            </li>
            <li>
              <router-link to="/contact">
                <i class="fas fa-envelope mr-2"></i>
                聯絡我們
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  @apply min-h-screen flex items-center justify-center py-20;
}

.container {
  @apply max-w-2xl mx-auto px-4 sm:px-6 lg:px-8;
}

.error-content {
  @apply text-center;
}

.error-illustration {
  @apply relative mb-8;
}

.error-illustration i {
  @apply text-8xl text-accent-blue/30 mb-4;
}

.error-number {
  @apply text-9xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent leading-none;
}

.error-title {
  @apply text-3xl font-bold text-white mb-4;
}

.error-description {
  @apply text-gray-300 text-lg mb-8 leading-relaxed;
}

.error-actions {
  @apply flex flex-col sm:flex-row gap-4 justify-center mb-12;
}

.suggested-links h3 {
  @apply text-xl font-semibold text-white mb-4;
}

.suggested-links ul {
  @apply space-y-3;
}

.suggested-links a {
  @apply inline-flex items-center text-accent-blue hover:text-accent-cyan transition-colors duration-300;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .error-number {
    @apply text-6xl;
  }
  
  .error-illustration i {
    @apply text-6xl;
  }
  
  .error-title {
    @apply text-2xl;
  }
}
</style>