import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

export const useNotificationStore = defineStore('notification', () => {
  const current = ref({
    show: false,
    title: '',
    message: '',
    type: 'info'
  })

  const show = (options) => {
    const { title = '', message = '', type = 'info', duration = 3000 } = options
    
    ElNotification({
      title,
      message,
      type,
      duration,
      position: 'top-right'
    })
  }

  const success = (message, title = '成功') => {
    show({ title, message, type: 'success' })
  }

  const error = (message, title = '錯誤') => {
    show({ title, message, type: 'error' })
  }

  const warning = (message, title = '警告') => {
    show({ title, message, type: 'warning' })
  }

  const info = (message, title = '提示') => {
    show({ title, message, type: 'info' })
  }

  const hide = () => {
    current.value.show = false
  }

  return {
    current,
    show,
    success,
    error,
    warning,
    info,
    hide
  }
})