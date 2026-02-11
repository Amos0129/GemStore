<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toastClass(toast.type)"
      >
        <div class="toast-icon">
          <i :class="toastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button 
          class="toast-close"
          @click="removeToast(toast.id)"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const toastClass = (type) => {
  const classes = {
    'success': 'border-green-500 bg-green-500/10',
    'error': 'border-red-500 bg-red-500/10',
    'warning': 'border-yellow-500 bg-yellow-500/10',
    'info': 'border-blue-500 bg-blue-500/10'
  }
  return classes[type] || classes.info
}

const toastIcon = (type) => {
  const icons = {
    'success': 'fas fa-check-circle text-green-500',
    'error': 'fas fa-exclamation-circle text-red-500',
    'warning': 'fas fa-exclamation-triangle text-yellow-500',
    'info': 'fas fa-info-circle text-blue-500'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  @apply fixed bottom-6 right-6 z-50 space-y-3 max-w-sm;
}

.toast {
  @apply flex items-start space-x-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg;
}

.toast-icon {
  @apply flex-shrink-0 text-xl;
}

.toast-content {
  @apply flex-1 min-w-0;
}

.toast-message {
  @apply text-white font-medium;
}

.toast-close {
  @apply flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-300 ml-2;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .toast-container {
    @apply left-6 right-6 max-w-none;
  }
  
  .toast {
    @apply p-3;
  }
}
</style>