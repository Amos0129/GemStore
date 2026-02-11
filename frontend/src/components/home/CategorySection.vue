<template>
  <section class="category-section">
    <div class="container">
      <h2 class="section-title">商品分類</h2>
      <div class="category-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
          @click="navigateToCategory(category.slug)"
        >
          <div class="category-icon">
            <i :class="category.icon"></i>
          </div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-description">{{ category.description }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 模擬商品分類數據，後續將從 API 獲取
const categories = [
  {
    id: 1,
    name: '水晶手鍊',
    slug: 'bracelet',
    description: '精美天然水晶手鍊',
    icon: 'fas fa-gem'
  },
  {
    id: 2,
    name: '晶礦戒指',
    slug: 'ring',
    description: '獨特晶礦戒指設計',
    icon: 'fas fa-ring'
  },
  {
    id: 3,
    name: '晶礦耳飾',
    slug: 'earring',
    description: '優雅晶礦耳環',
    icon: 'fas fa-star'
  },
  {
    id: 4,
    name: '晶礦項鍊',
    slug: 'necklace',
    description: '時尚晶礦項鍊',
    icon: 'fas fa-heart'
  },
  {
    id: 5,
    name: '原礦擺件',
    slug: 'ornament',
    description: '天然原礦擺設',
    icon: 'fas fa-cube'
  },
  {
    id: 6,
    name: '淨化商品',
    slug: 'purify',
    description: '能量淨化用品',
    icon: 'fas fa-spa'
  }
]

const navigateToCategory = (slug) => {
  router.push(`/category/${slug}`)
}
</script>

<style scoped>
.category-section {
  @apply py-20;
  background-color: #FFFFFF;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-title {
  @apply text-4xl md:text-5xl font-bold text-center mb-16;
  color: #8B5CF6;
}

.category-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6;
}

.category-card {
  @apply card text-center cursor-pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  @apply transform -translate-y-3;
  box-shadow: 0 8px 30px rgba(196, 181, 253, 0.3);
}

.category-icon {
  @apply text-5xl mb-4 transition-colors duration-300;
  color: #C4B5FD;
}

.category-card:hover .category-icon {
  color: #8B5CF6;
}

.category-name {
  @apply text-xl font-semibold mb-2;
  color: #6B21A8;
}

.category-description {
  @apply text-sm;
  color: #A78BFA;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .category-section {
    @apply py-12;
  }
  
  .container {
    @apply px-3;
  }
  
  .section-title {
    @apply text-2xl mb-8;
  }
  
  .category-grid {
    @apply grid-cols-2 gap-3;
  }
  
  .category-card {
    @apply p-4;
  }
  
  .category-icon {
    @apply text-3xl mb-2;
  }
  
  .category-name {
    @apply text-base mb-1;
  }
  
  .category-description {
    @apply text-xs leading-tight;
  }
}

@media (max-width: 480px) {
  .category-section {
    @apply py-10;
  }
  
  .section-title {
    @apply text-xl mb-6;
  }
  
  .category-grid {
    @apply gap-2;
  }
  
  .category-card {
    @apply p-3;
  }
  
  .category-icon {
    @apply text-2xl mb-1;
  }
  
  .category-name {
    @apply text-sm mb-1;
  }
  
  .category-description {
    @apply text-xs;
  }
}
</style>