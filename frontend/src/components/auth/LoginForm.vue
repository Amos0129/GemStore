<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          電子郵件
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請輸入電子郵件"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          密碼
        </label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請輸入密碼"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="form.rememberMe"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            記住我
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-purple-600 hover:text-purple-500">
            忘記密碼？
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">登入</span>
          <span v-else>登入中...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(false)
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    await userStore.login(form.email, form.password)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    // Handle login error
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>