<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: '載入中...'
  }
})
</script>

<style scoped>
.loading-overlay {
  @apply fixed inset-0 z-[9999] flex items-center justify-center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.loading-content {
  @apply text-center;
}

.spinner {
  @apply w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full mx-auto mb-4;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-white text-lg font-medium;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>