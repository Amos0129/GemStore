<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label for="email" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
          電子郵件
        </label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="請輸入電子郵件"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
          密碼
        </label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="請輸入密碼"
        />
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            id="remember-me"
            v-model="form.rememberMe"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 border-gray-300 rounded"
            style="color: #2E86AB;"
            @focus="$event.target.style.boxShadow='0 0 0 2px rgba(46, 134, 171, 0.2)'"
            @blur="$event.target.style.boxShadow='none'"
          />
          <span class="ml-2 text-sm text-gray-600">記住我</span>
        </label>
        <a href="#" class="text-sm font-medium" style="color: #2E86AB;" @mouseover="$event.target.style.color='#1B4F72'" @mouseout="$event.target.style.color='#2E86AB'">
          忘記密碼？
        </a>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full text-white py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style="background: #2E86AB;"
          @mouseover="!isLoading && ($event.target.style.background='#1B4F72')"
          @mouseout="!isLoading && ($event.target.style.background='#2E86AB')"
        >
          <span v-if="!isLoading">登入</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登入中...
          </span>
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
    const result = await userStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      router.push('/')
    } else {
      console.error('Login failed:', result.error)
      // 你可以在這裡添加錯誤提示
    }
  } catch (error) {
    console.error('Login failed:', error)
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