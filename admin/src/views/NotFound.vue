<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-title">頁面不存在</div>
      <div class="error-description">
        很抱歉，您要尋找的頁面可能已被移動或刪除。
      </div>
      <el-button 
        type="primary" 
        size="large" 
        @click="goHome"
        class="back-btn"
      >
        <el-icon><House /></el-icon>
        返回首頁
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.not-found-content {
  max-width: 400px;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 24px;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.error-description {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.5;
}

.back-btn {
  font-size: 16px;
  padding: 12px 24px;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
}
</style>