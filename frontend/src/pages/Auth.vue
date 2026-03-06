<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style="background: linear-gradient(135deg, #F8FBFF 0%, #E8F4F8 100%);">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex justify-center items-center mb-6">
          <div class="w-12 h-12 flex items-center justify-center" style="color: #1B4F72;">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" stroke-width="2"/>
              <path d="M22 7L12 12L2 7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h1 class="ml-3 text-2xl font-bold" style="color: #1B4F72; letter-spacing: 0.1em;">CRYSTAL</h1>
        </div>
        <h2 class="text-xl font-semibold mb-2" style="color: #1B4F72;">
          {{ isLogin ? '登入您的帳號' : '建立新帳號' }}
        </h2>
        <p class="text-sm" style="color: #6B7280;">
          {{ isLogin ? '還沒有帳號？' : '已經有帳號了？' }}
          <button
            @click="toggleMode"
            class="font-medium ml-1"
            style="color: #2E86AB;"
          >
            {{ isLogin ? '立即註冊' : '立即登入' }}
          </button>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <LoginForm v-if="isLogin" />
        <RegisterForm v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const route = useRoute()
const router = useRouter()

const isLogin = ref(true)

// 根據路由自動設定模式
const updateModeFromRoute = () => {
  isLogin.value = route.path === '/auth/login' || route.path === '/auth'
}

const toggleMode = () => {
  if (isLogin.value) {
    router.push('/auth/register')
  } else {
    router.push('/auth/login')
  }
  isLogin.value = !isLogin.value
}

onMounted(() => {
  updateModeFromRoute()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>