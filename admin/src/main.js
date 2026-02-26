import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useUserStore } from './store/user'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 註冊所有圖標
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 應用啟動時檢查認證狀態
const userStore = useUserStore()
if (userStore.token && !userStore.user) {
  userStore.checkAuth().catch(() => {
    // 如果檢查失敗，清除無效的 token
    userStore.logout()
  })
}

app.mount('#app')