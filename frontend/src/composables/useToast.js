import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    // 自動移除 toast
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  }
}