<template>
  <div class="home">
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Category Section -->
    <CategorySection />
    
    <!-- Featured Products -->
    <ProductSection
      title="精選商品"
      :products="productsStore.featuredProducts"
      :loading="productsStore.isLoading"
    />
    
    <!-- New Products -->
    <ProductSection
      title="最新上架"
      :products="productsStore.newProducts"
      :loading="productsStore.isLoading"
    />
    
    <!-- Sale Products -->
    <ProductSection
      title="限時優惠"
      :products="productsStore.saleProducts"
      :loading="productsStore.isLoading"
      badge="sale"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/store/products'

import HeroSection from '@/components/home/HeroSection.vue'
import CategorySection from '@/components/home/CategorySection.vue'
import ProductSection from '@/components/home/ProductSection.vue'

const productsStore = useProductStore()

onMounted(async () => {
  // 載入商品數據
  await productsStore.fetchProducts()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #FFFFFF;
}
</style>