<template>
  <div class="login-container">
    <div class="login-background">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <i class="fas fa-bolt"></i>
        </div>
        <h1 class="title">NEXUS ADMIN</h1>
        <p class="subtitle">晶礦飾品管理系統</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="請輸入管理員帳號"
            size="large"
            :prefix-icon="User"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="請輸入密碼"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="rememberMe" class="remember-me">
            記住我
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="userStore.isLoading"
            @click="handleLogin"
          >
            {{ userStore.isLoading ? '登入中...' : '登入' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tips">
        <el-alert
          title="測試帳號"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>帳號：admin</p>
            <p>密碼：admin123</p>
          </template>
        </el-alert>
      </div>
    </div>
    
    <!-- Kuse Branding -->
    <div class="kuse-branding" @click="openKuseLink">
      <span>made with</span>
      <svg viewBox="0,0,160,44" xmlns="http://www.w3.org/2000/svg">
        <path d="m.01,20.65C-.43,8.25,9.3-2.03,22.04.34,34.78,2.72,43.29,8.32,43.29,22.9s-8.66,19.01-22.03,20.3C7.9,44.5.46,33.05.01,20.65z" fill="currentColor"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="m146.76,7.94c8.07,0,13.24,6.15,13.24,14.58v1.39h-20.75c.45,4.05,3.51,7.37,8.57,7.37,2.62,0,5.73-1.05,7.62-2.94l2.67,3.83c-2.67,2.55-6.62,3.88-10.9,3.88-8.07,0-14.08-5.6-14.08-14.08,0-7.76,5.67-14.02,13.63-14.02zm0,4.77c-5.01,0-7.29,3.83-7.57,7.1h15.13c-.11-3.16-2.28-7.1-7.57-7.1z" fill="currentColor"></path>
        <path d="m86.64,24.49c0,4.15,2.39,6.84,6.84,6.84,4.4,0,6.84-2.69,6.84-6.84V8.55h5.37v16.33c0,6.7-4.06,11.14-12.21,11.14-8.21,0-12.21-4.5-12.21-11.09V8.55h5.37v15.94zm32.99-16.55c4.49,0,8.06,1.47,10.6,3.86l-2.59,3.81c-2.05-2-5.28-3.08-8.06-3.08-2.88,0-4.84,1.37-4.84,3.32,0,1.91,2.64,2.54,5.81,3.27,4.59,1.08,10.26,2.4,10.26,8.46,0,4.94-3.76,8.41-11.14,8.41-4.98,0-8.94-1.76-11.24-4.11l2.54-4.11c1.86,1.91,5.18,3.67,8.84,3.67,3.91,0,5.57-1.66,5.57-3.62,0-2.3-2.88-2.98-6.21-3.76-4.54-1.08-9.87-2.3-9.87-8.06,0-4.5,4.2-8.06,10.31-8.06zM60.79,20.82,71.44,8.55h6.5L66.46,21.26,78.82,35.44h-6.5l-9.28-11.1-2.25,2.49v8.6h-5.33V8.55h5.33v12.27z" fill="currentColor"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const loginFormRef = ref()
const rememberMe = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules = {
  username: [
    { required: true, message: '請輸入管理員帳號', trigger: 'blur' },
    { min: 3, max: 20, message: '帳號長度應為 3-20 個字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少需要 6 個字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    const result = await userStore.login(loginForm)
    
    if (result.success) {
      notificationStore.success('登入成功！')
      
      // 跳轉到原來要訪問的頁面或儀表板
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      notificationStore.error(result.error || '登入失敗')
    }
  } catch (error) {
    notificationStore.error('登入過程中發生錯誤')
    console.error('Login error:', error)
  }
}

const openKuseLink = () => {
  window.open('https://kuse.ai', '_blank')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.bg-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.login-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 24px;
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.remember-me {
  color: var(--text-secondary);
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green)) !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.5) !important;
}

.login-tips {
  text-align: center;
}

.kuse-branding {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 1;
}

.kuse-branding:hover {
  color: var(--neon-blue);
}

.kuse-branding svg {
  height: 1em;
}

@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }
  100% { box-shadow: 0 0 40px rgba(0, 255, 170, 0.8); }
}

/* 響應式設計 */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 32px 24px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
}
</style>