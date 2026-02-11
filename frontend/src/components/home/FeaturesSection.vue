<template>
  <section class="features-section">
    <div class="container">
      <h2 class="section-title">為什麼選擇我們</h2>
      
      <div class="features-grid">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="feature-card"
        >
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
      
      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stats-grid">
          <div 
            v-for="stat in stats" 
            :key="stat.id"
            class="stat-item"
          >
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    id: 1,
    icon: 'fas fa-gem',
    title: '天然保證',
    description: '所有水晶均為天然開採，經過專業鑑定，確保品質純正'
  },
  {
    id: 2,
    icon: 'fas fa-shipping-fast',
    title: '快速配送',
    description: '24小時內出貨，全台灣2-3天到貨，超商取貨免運費'
  },
  {
    id: 3,
    icon: 'fas fa-shield-check',
    title: '品質保障',
    description: '7天無條件退換貨，一年品質保固，售後服務完善'
  },
  {
    id: 4,
    icon: 'fas fa-video',
    title: '直播互動',
    description: '每週三次直播，即時互動諮詢，專業水晶知識分享'
  },
  {
    id: 5,
    icon: 'fas fa-certificate',
    title: '專業認證',
    description: '專業水晶顧問團隊，提供個人化能量搭配建議'
  },
  {
    id: 6,
    icon: 'fas fa-heart',
    title: '用心服務',
    description: '專屬客服團隊，LINE即時回覆，用心為您服務'
  }
]

const stats = [
  {
    id: 1,
    number: '10000+',
    label: '滿意客戶'
  },
  {
    id: 2,
    number: '500+',
    label: '精選商品'
  },
  {
    id: 3,
    number: '99%',
    label: '好評率'
  },
  {
    id: 4,
    number: '24H',
    label: '快速出貨'
  }
]
</script>

<style scoped>
.features-section {
  @apply py-20 bg-gradient-to-b from-transparent to-background-secondary/50;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-title {
  @apply text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20;
}

.feature-card {
  @apply card text-center hover:scale-105 transition-transform duration-300;
}

.feature-icon {
  @apply text-5xl text-purple-600 mb-6 transition-colors duration-300;
}

.feature-title {
  @apply text-xl font-semibold text-white mb-4;
}

.feature-description {
  @apply text-gray-300 leading-relaxed;
}

.stats-section {
  @apply py-16 border-t border-accent-blue/20;
}

.stats-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-8;
}

.stat-item {
  @apply text-center;
}

.stat-number {
  @apply text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent mb-2;
}

.stat-label {
  @apply text-gray-300 font-medium;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .features-grid {
    @apply grid-cols-1 gap-6;
  }
  
  .feature-icon {
    @apply text-4xl mb-4;
  }
  
  .feature-title {
    @apply text-lg;
  }
  
  .stat-number {
    @apply text-3xl;
  }
}
</style>