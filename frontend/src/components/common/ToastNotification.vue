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
  // 使用統一的馬卡龍藍風格
  return 'toast-macaron-blue'
}

const toastIcon = (type) => {
  const icons = {
    'success': 'fas fa-check-circle',
    'error': 'fas fa-exclamation-circle text-red-400',
    'warning': 'fas fa-exclamation-triangle text-yellow-400',
    'info': 'fas fa-info-circle'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  @apply fixed bottom-6 right-6 z-50 space-y-3 max-w-sm;
}

.toast {
  @apply flex items-start space-x-3 p-5 rounded-xl border-2 backdrop-blur-sm;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px rgba(96, 165, 250, 0.3);
  border-color: #60A5FA;
}

.toast-icon {
  @apply flex-shrink-0 text-xl;
  color: #60A5FA;
}

.toast-content {
  @apply flex-1 min-w-0;
}

.toast-message {
  @apply font-semibold text-lg;
  color: #1E3A8A;
}

.toast-close {
  @apply flex-shrink-0 transition-colors duration-300 ml-2;
  color: #94A3B8;
}

.toast-close:hover {
  color: #60A5FA;
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