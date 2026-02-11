<template>
  <div class="product-card-skeleton">
    <!-- Image Skeleton -->
    <div class="image-skeleton"></div>
    
    <!-- Content Skeleton -->
    <div class="content-skeleton">
      <!-- Title Skeleton -->
      <div class="title-skeleton"></div>
      
      <!-- Rating Skeleton -->
      <div class="rating-skeleton">
        <div class="stars-skeleton"></div>
        <div class="count-skeleton"></div>
      </div>
      
      <!-- Price Skeleton -->
      <div class="price-skeleton">
        <div class="current-price-skeleton"></div>
        <div class="original-price-skeleton"></div>
      </div>
      
      <!-- Button Skeleton -->
      <div class="button-skeleton"></div>
    </div>
  </div>
</template>

<script setup>
// No props needed for skeleton component
</script>

<style scoped>
.product-card-skeleton {
  @apply bg-background-card border border-accent-blue/20 rounded-2xl overflow-hidden;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.image-skeleton {
  @apply h-64 bg-gray-700/50;
}

.content-skeleton {
  @apply p-6 space-y-4;
}

.title-skeleton {
  @apply h-6 bg-gray-700/50 rounded w-3/4;
}

.rating-skeleton {
  @apply flex items-center space-x-2;
}

.stars-skeleton {
  @apply h-4 bg-gray-700/50 rounded w-20;
}

.count-skeleton {
  @apply h-4 bg-gray-700/50 rounded w-12;
}

.price-skeleton {
  @apply flex items-center space-x-2;
}

.current-price-skeleton {
  @apply h-8 bg-gray-700/50 rounded w-16;
}

.original-price-skeleton {
  @apply h-5 bg-gray-700/50 rounded w-12;
}

.button-skeleton {
  @apply h-12 bg-gray-700/50 rounded;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}
</style>