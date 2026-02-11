<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          姓名
        </label>
        <div class="mt-1">
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請輸入姓名"
          />
        </div>
      </div>

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
            autocomplete="new-password"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請輸入密碼"
          />
        </div>
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
          確認密碼
        </label>
        <div class="mt-1">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請再次輸入密碼"
          />
        </div>
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700">
          手機號碼
        </label>
        <div class="mt-1">
          <input
            id="phone"
            v-model="form.phone"
            name="phone"
            type="tel"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="請輸入手機號碼"
          />
        </div>
      </div>

      <div class="flex items-center">
        <input
          id="agree-terms"
          v-model="form.agreeTerms"
          name="agree-terms"
          type="checkbox"
          required
          class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
          我同意 <a href="#" class="text-purple-600 hover:text-purple-500">服務條款</a> 和 <a href="#" class="text-purple-600 hover:text-purple-500">隱私政策</a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">註冊</span>
          <span v-else>註冊中...</span>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  agreeTerms: false
})

const handleSubmit = async () => {
  if (isLoading.value) return
  
  if (form.password !== form.confirmPassword) {
    alert('密碼確認不一致')
    return
  }
  
  if (!form.agreeTerms) {
    alert('請同意服務條款')
    return
  }
  
  isLoading.value = true
  
  try {
    await userStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone
    })
    router.push('/')
  } catch (error) {
    console.error('Register failed:', error)
    // Handle register error
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>