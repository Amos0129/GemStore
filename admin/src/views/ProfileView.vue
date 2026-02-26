<template>
  <div class="profile-view">
    <div class="view-header">
      <h1>個人資料</h1>
    </div>

    <el-row :gutter="24">
      <!-- 個人資料卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="profile-info">
            <div class="avatar-section">
              <el-avatar :size="80" :src="userStore.userInfo.avatar">
                {{ userStore.userInfo.name?.[0] || 'A' }}
              </el-avatar>
              <el-button 
                type="primary" 
                size="small" 
                @click="showAvatarUpload = true"
                class="change-avatar-btn"
              >
                更換頭像
              </el-button>
            </div>
            
            <div class="user-details">
              <h3>{{ userStore.userInfo.name }}</h3>
              <p class="user-email">{{ userStore.userInfo.email }}</p>
              <p class="user-role">{{ getRoleText(userStore.userInfo.role) }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-label">最後登入</span>
                  <span class="stat-value">{{ formatDate(userStore.userInfo.lastLoginAt) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">註冊時間</span>
                  <span class="stat-value">{{ formatDate(userStore.userInfo.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 編輯表單 -->
      <el-col :span="16">
        <el-card title="編輯個人資料">
          <el-form 
            :model="profileForm" 
            :rules="formRules" 
            ref="formRef"
            label-width="120px"
            v-loading="userStore.isLoading"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓氏" prop="firstName">
                  <el-input v-model="profileForm.firstName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="名字" prop="lastName">
                  <el-input v-model="profileForm.lastName" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="電子信箱" prop="email">
              <el-input v-model="profileForm.email" disabled />
              <div class="form-help-text">電子信箱無法修改</div>
            </el-form-item>
            
            <el-form-item label="電話號碼" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="請輸入電話號碼" />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="updateProfile"
                :loading="userStore.isLoading"
              >
                更新資料
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 修改密碼 -->
        <el-card title="修改密碼" class="password-card">
          <el-form 
            :model="passwordForm" 
            :rules="passwordRules" 
            ref="passwordFormRef"
            label-width="120px"
          >
            <el-form-item label="當前密碼" prop="currentPassword">
              <el-input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                show-password
                placeholder="請輸入當前密碼"
              />
            </el-form-item>
            
            <el-form-item label="新密碼" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password" 
                show-password
                placeholder="請輸入新密碼"
              />
            </el-form-item>
            
            <el-form-item label="確認新密碼" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                show-password
                placeholder="請確認新密碼"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="danger" 
                @click="changePassword"
                :loading="userStore.isLoading"
              >
                修改密碼
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 頭像上傳對話框 -->
    <el-dialog v-model="showAvatarUpload" title="更換頭像" width="500px">
      <div class="avatar-upload-section">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
        >
          <img v-if="newAvatarUrl" :src="newAvatarUrl" class="avatar-preview" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-help">
          <p>點擊上傳頭像</p>
          <p class="help-text">支援 JPG、PNG 格式，大小不超過 2MB</p>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showAvatarUpload = false">取消</el-button>
        <el-button type="primary" @click="uploadAvatar" :disabled="!newAvatarUrl">
          確認更換
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
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
.profile-view {
  padding: 24px;
}

.view-header {
  margin-bottom: 24px;
}

.view-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.profile-card {
  margin-bottom: 24px;
}

.profile-info {
  text-align: center;
}

.avatar-section {
  margin-bottom: 24px;
}

.change-avatar-btn {
  margin-top: 12px;
}

.user-details h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
}

.user-email {
  color: var(--el-text-color-regular);
  margin: 0 0 4px 0;
}

.user-role {
  color: var(--el-color-primary);
  font-weight: 500;
  margin: 0 0 20px 0;
}

.user-stats {
  text-align: left;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.stat-label {
  color: var(--el-text-color-regular);
}

.stat-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.password-card {
  margin-top: 24px;
}

.form-help-text {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  margin-top: 4px;
}

.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-uploader {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.upload-help p {
  margin: 0;
}

.help-text {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}
</style>