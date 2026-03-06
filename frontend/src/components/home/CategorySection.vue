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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store/products'

const router = useRouter()
const productStore = useProductStore()

const categories = ref([])

onMounted(async () => {
  await productStore.fetchCategories()
  categories.value = productStore.categories
})

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
  color: #1B4F72;
}

.category-grid {
  @apply flex flex-wrap justify-center gap-6;
}

.category-card {
  @apply card text-center cursor-pointer;
  transition: all 0.3s ease;
  width: 200px;
  flex-shrink: 0;
}

.category-card:hover {
  @apply transform -translate-y-3;
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.3);
}

.category-icon {
  @apply text-5xl mb-4 transition-colors duration-300;
  color: #93C5FD;
}

.category-card:hover .category-icon {
  color: #60A5FA;
}

.category-name {
  @apply text-xl font-semibold mb-2;
  color: #1B4F72;
}

.category-description {
  @apply text-sm;
  color: #1B4F72;
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
    @apply gap-3;
  }
  
  .category-card {
    @apply p-4;
    width: 150px;
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
    width: 140px;
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