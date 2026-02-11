<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-auto flex justify-center">
          <h2 class="text-center text-3xl font-extrabold text-gray-900">
            晶礦飾品
          </h2>
        </div>
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
          {{ isLogin ? '登入您的帳號' : '建立新帳號' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLogin ? '還沒有帳號？' : '已經有帳號了？' }}
          <button
            @click="toggleMode"
            class="font-medium text-purple-600 hover:text-purple-500"
          >
            {{ isLogin ? '立即註冊' : '立即登入' }}
          </button>
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <div class="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <LoginForm v-if="isLogin" />
          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const isLogin = ref(true)

const toggleMode = () => {
  isLogin.value = !isLogin.value
}
</script>

<style scoped>
/* Additional styles if needed */
</style>