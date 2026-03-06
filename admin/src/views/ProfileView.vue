<template>
  <div class="profile-view">
    <!-- 現代化頭部 -->
    <div class="profile-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-left">
          <div class="avatar-section">
            <div class="avatar-container" @click="showAvatarUpload = true">
              <el-avatar :size="100" :src="userStore.userInfo.avatar" class="main-avatar">
                {{ userStore.userInfo.name?.[0] || 'A' }}
              </el-avatar>
              <div class="avatar-overlay">
                <el-icon class="camera-icon"><Camera /></el-icon>
              </div>
            </div>
          </div>
          
          <div class="user-info">
            <h1 class="user-name">{{ userStore.userInfo.name || '管理員' }}</h1>
            <p class="user-email">{{ userStore.userInfo.email || 'admin@example.com' }}</p>
            <div class="user-badge">
              <el-tag type="success" size="large">{{ getRoleText(userStore.userInfo.role) }}</el-tag>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <div class="user-stats-cards">
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">最後登入</div>
                <div class="stat-value">{{ formatDate(userStore.userInfo.lastLoginAt) }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">註冊時間</div>
                <div class="stat-value">{{ formatDate(userStore.userInfo.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="profile-content">
      <div class="content-wrapper">
        <div class="content-grid">
          <!-- 個人資料編輯 -->
          <div class="profile-section">
          <div class="section-header">
            <h2>個人資料</h2>
            <p>管理您的個人資訊</p>
          </div>
          
          <div class="form-container">
            <el-form 
              :model="profileForm" 
              :rules="formRules" 
              ref="formRef"
              label-position="top"
              v-loading="userStore.isLoading"
              class="modern-form"
            >
              <div class="form-row">
                <el-form-item label="姓氏" prop="firstName">
                  <el-input 
                    v-model="profileForm.firstName" 
                    placeholder="請輸入姓氏"
                    class="form-input"
                  />
                </el-form-item>
                <el-form-item label="名字" prop="lastName">
                  <el-input 
                    v-model="profileForm.lastName" 
                    placeholder="請輸入名字"
                    class="form-input"
                  />
                </el-form-item>
              </div>
              
              <el-form-item label="電子信箱" prop="email">
                <el-input 
                  v-model="profileForm.email" 
                  disabled 
                  class="form-input"
                >
                  <template #prefix>
                    <el-icon><Message /></el-icon>
                  </template>
                </el-input>
                <div class="form-tip">電子信箱無法修改</div>
              </el-form-item>
              
              <el-form-item label="電話號碼" prop="phone">
                <el-input 
                  v-model="profileForm.phone" 
                  placeholder="請輸入電話號碼"
                  class="form-input"
                >
                  <template #prefix>
                    <el-icon><Phone /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <div class="form-actions">
                <el-button 
                  type="primary" 
                  @click="updateProfile"
                  :loading="userStore.isLoading"
                  size="large"
                  class="action-btn primary-btn"
                >
                  <el-icon><Check /></el-icon>
                  更新資料
                </el-button>
                <el-button 
                  @click="resetForm" 
                  size="large"
                  class="action-btn secondary-btn"
                >
                  <el-icon><Refresh /></el-icon>
                  重置
                </el-button>
              </div>
            </el-form>
          </div>
        </div>

        <!-- 密碼修改 -->
        <div class="password-section">
          <div class="section-header">
            <h2>安全設置</h2>
            <p>修改您的登入密碼</p>
          </div>
          
          <div class="form-container">
            <el-form 
              :model="passwordForm" 
              :rules="passwordRules" 
              ref="passwordFormRef"
              label-position="top"
              class="modern-form"
            >
              <el-form-item label="當前密碼" prop="currentPassword">
                <el-input 
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  show-password
                  placeholder="請輸入當前密碼"
                  class="form-input"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="新密碼" prop="newPassword">
                <el-input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  show-password
                  placeholder="請輸入新密碼（至少6位）"
                  class="form-input"
                >
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="確認新密碼" prop="confirmPassword">
                <el-input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  show-password
                  placeholder="請再次確認新密碼"
                  class="form-input"
                >
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <div class="form-actions">
                <el-button 
                  type="danger" 
                  @click="changePassword"
                  :loading="userStore.isLoading"
                  size="large"
                  class="action-btn danger-btn"
                >
                  <el-icon><Edit /></el-icon>
                  修改密碼
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 現代化頭像上傳對話框 -->
    <el-dialog 
      v-model="showAvatarUpload" 
      title="更換頭像" 
      width="480px"
      class="avatar-dialog"
    >
      <div class="upload-container">
        <div class="upload-preview">
          <el-upload
            class="avatar-uploader-modern"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
          >
            <div class="upload-area">
              <img v-if="newAvatarUrl" :src="newAvatarUrl" class="preview-image" />
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">點擊選擇圖片</div>
              </div>
            </div>
          </el-upload>
        </div>
        
        <div class="upload-info">
          <h3>頭像上傳</h3>
          <ul class="upload-rules">
            <li>支援 JPG、PNG 格式</li>
            <li>文件大小不超過 2MB</li>
            <li>建議尺寸 200x200 像素</li>
          </ul>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAvatarUpload = false" size="large">取消</el-button>
          <el-button 
            type="primary" 
            @click="uploadAvatar" 
            :disabled="!newAvatarUrl"
            size="large"
          >
            確認更換
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Plus, Camera, Calendar, User, Message, Phone, Lock, Key, 
  Check, Refresh, Edit 
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const formRef = ref()
const passwordFormRef = ref()
const showAvatarUpload = ref(false)
const newAvatarUrl = ref('')

// 個人資料表單
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// 密碼表單
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表單驗證規則
const formRules = {
  firstName: [
    { required: true, message: '請輸入姓氏', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: '請輸入名字', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '請輸入當前密碼', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '請確認新密碼', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('兩次輸入密碼不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 初始化表單數據
const initializeForm = () => {
  const userInfo = userStore.userInfo
  profileForm.firstName = userInfo.name?.split(' ')[0] || ''
  profileForm.lastName = userInfo.name?.split(' ')[1] || ''
  profileForm.email = userInfo.email || ''
  profileForm.phone = userInfo.phone || ''
}

// 獲取角色文本
const getRoleText = (role) => {
  const roleMap = {
    admin: '系統管理員',
    user: '一般用戶'
  }
  return roleMap[role] || role
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-TW')
}

// 更新個人資料
const updateProfile = async () => {
  try {
    await formRef.value.validate()
    
    const result = await userStore.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone
    })
    
    if (result.success) {
      ElMessage.success('個人資料更新成功')
    } else {
      ElMessage.error(result.error || '更新失敗')
    }
  } catch (error) {
    console.error('表單驗證失敗')
  }
}

// 重置表單
const resetForm = () => {
  initializeForm()
}

// 修改密碼
const changePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    
    const result = await userStore.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (result.success) {
      ElMessage.success('密碼修改成功')
      // 清空表單
      Object.keys(passwordForm).forEach(key => {
        passwordForm[key] = ''
      })
      passwordFormRef.value.resetFields()
    } else {
      ElMessage.error(result.error || '密碼修改失敗')
    }
  } catch (error) {
    console.error('表單驗證失敗')
  }
}

// 頭像上傳前檢查
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('頭像圖片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('頭像圖片大小不能超過 2MB!')
    return false
  }

  // 預覽圖片
  const reader = new FileReader()
  reader.onload = (e) => {
    newAvatarUrl.value = e.target.result
  }
  reader.readAsDataURL(file)

  return false // 阻止自動上傳
}

// 上傳頭像
const uploadAvatar = async () => {
  try {
    // 這裡應該實現頭像上傳邏輯
    ElMessage.info('頭像上傳功能開發中...')
    showAvatarUpload.value = false
    newAvatarUrl.value = ''
  } catch (error) {
    ElMessage.error('頭像上傳失敗')
  }
}

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
/* 主容器 */
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%);
}

/* 現代化頭部 */
.profile-header {
  position: relative;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 40px 0 80px 0;
  margin-bottom: 40px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 1;
}

/* 頭部左右區域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

/* 頭像區域 */
.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.main-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #3498db, #2c3e50);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 24px;
  color: white;
}

/* 用戶信息 */
.user-info {
  flex: 1;
}

.user-name {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.user-email {
  font-size: 16px;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.user-badge {
  margin-bottom: 0;
}

/* 統計卡片 */
.user-stats-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  align-items: flex-end;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  width: 200px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
}

/* 主要內容區域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

.content-wrapper {
  width: 100%;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 0;
  padding: 0;
  align-items: start;
}

/* 區塊樣式 */
.profile-section,
.password-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  height: 580px;
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f7fa;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.section-header p {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

/* 表單容器 */
.form-container {
  position: relative;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 表單輸入框 */
.form-input {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.form-input:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-tip {
  font-size: 12px;
  color: #718096;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 表單動作按鈕 */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.action-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.primary-btn:hover {
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.secondary-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.secondary-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.danger-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.danger-btn:hover {
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

/* 頭像上傳對話框 */
.avatar-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.upload-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.upload-preview {
  flex-shrink: 0;
}

.avatar-uploader-modern {
  display: block;
}

.upload-area {
  width: 180px;
  height: 180px;
  border: 3px dashed #e2e8f0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.upload-area:hover {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #718096;
}

.upload-icon {
  font-size: 32px;
  color: #cbd5e0;
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
}

.upload-info {
  flex: 1;
}

.upload-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #2d3748;
}

.upload-rules {
  list-style: none;
  padding: 0;
  margin: 0;
}

.upload-rules li {
  padding: 8px 0;
  color: #718096;
  position: relative;
  padding-left: 20px;
}

.upload-rules li::before {
  content: '•';
  color: #3498db;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .header-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .header-right {
    justify-content: center;
  }
  
  .user-stats-cards {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 24px 0 40px 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .user-stats-cards {
    flex-direction: column;
  }
  
  .stat-card {
    min-width: auto;
  }
  
  .upload-container {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

/* 移除動畫效果，保持簡潔 */
</style>