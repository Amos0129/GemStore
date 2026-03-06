<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
            姓氏
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            name="firstName"
            type="text"
            required
            class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="請輸入姓氏"
          />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
            名字
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            name="lastName"
            type="text"
            required
            class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="請輸入名字"
          />
        </div>
      </div>

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
          autocomplete="new-password"
          required
          class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="請輸入密碼"
        />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
          確認密碼
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="請再次輸入密碼"
        />
      </div>

      <div>
        <label for="phone" class="block text-sm font-semibold mb-2" style="color: #1B4F72;">
          手機號碼
        </label>
        <input
          id="phone"
          v-model="form.phone"
          name="phone"
          type="tel"
          class="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="請輸入手機號碼"
        />
      </div>

      <div class="flex items-start">
        <input
          id="agree-terms"
          v-model="form.agreeTerms"
          name="agree-terms"
          type="checkbox"
          required
          class="h-4 w-4 mt-0.5 border-gray-300 rounded"
          style="color: #2E86AB;"
          @focus="$event.target.style.boxShadow='0 0 0 2px rgba(46, 134, 171, 0.2)'"
          @blur="$event.target.style.boxShadow='none'"
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-600">
          我同意 <a href="#" class="font-medium" style="color: #2E86AB;" @mouseover="$event.target.style.color='#1B4F72'" @mouseout="$event.target.style.color='#2E86AB'">服務條款</a> 和 <a href="#" class="font-medium" style="color: #2E86AB;" @mouseover="$event.target.style.color='#1B4F72'" @mouseout="$event.target.style.color='#2E86AB'">隱私政策</a>
        </label>
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
          <span v-if="!isLoading">註冊</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            註冊中...
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
  firstName: '',
  lastName: '',
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
    const result = await userStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone
    })
    
    if (result.success) {
      router.push('/')
    } else {
      console.error('Register failed:', result.error)
      // 你可以在這裡添加錯誤提示
    }
  } catch (error) {
    console.error('Register failed:', error)
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