<template>
  <div class="account-settings-view">
    <div class="view-header">
      <h1>帳號設定</h1>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 安全設定 -->
      <el-tab-pane label="安全設定" name="security">
        <div class="settings-section">
          <h3>登入安全</h3>
          
          <el-form label-width="140px">
            <el-form-item label="雙重驗證">
              <el-switch 
                v-model="securitySettings.twoFactorAuth"
                @change="updateTwoFactorAuth"
              />
              <div class="setting-description">
                啟用後，登入時需要額外的驗證碼確認
              </div>
            </el-form-item>

            <el-form-item label="登入提醒">
              <el-switch 
                v-model="securitySettings.loginNotification"
                @change="updateLoginNotification"
              />
              <div class="setting-description">
                有新設備登入時發送電子郵件通知
              </div>
            </el-form-item>

            <el-form-item label="密碼有效期">
              <el-select v-model="securitySettings.passwordExpiry" @change="updatePasswordExpiry">
                <el-option label="永不過期" :value="0" />
                <el-option label="30天" :value="30" />
                <el-option label="60天" :value="60" />
                <el-option label="90天" :value="90" />
              </el-select>
              <div class="setting-description">
                密碼到期後需要強制更新
              </div>
            </el-form-item>
          </el-form>

          <h3>最近登入記錄</h3>
          <el-table :data="loginHistory" style="width: 100%">
            <el-table-column prop="time" label="時間" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.time) }}
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="device" label="設備" />
            <el-table-column prop="location" label="位置" width="120" />
            <el-table-column prop="status" label="狀態" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                  {{ scope.row.status === 'success' ? '成功' : '失敗' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 通知設定 -->
      <el-tab-pane label="通知設定" name="notifications">
        <div class="settings-section">
          <h3>電子郵件通知</h3>
          
          <el-form label-width="140px">
            <el-form-item label="系統通知">
              <el-switch 
                v-model="notificationSettings.systemNotifications"
                @change="updateNotificationSettings"
              />
              <div class="setting-description">
                接收系統維護、更新等重要通知
              </div>
            </el-form-item>

            <el-form-item label="訂單通知">
              <el-switch 
                v-model="notificationSettings.orderNotifications"
                @change="updateNotificationSettings"
              />
              <div class="setting-description">
                新訂單、退款等訂單相關通知
              </div>
            </el-form-item>

            <el-form-item label="庫存警告">
              <el-switch 
                v-model="notificationSettings.inventoryAlerts"
                @change="updateNotificationSettings"
              />
              <div class="setting-description">
                商品庫存不足時發送警告
              </div>
            </el-form-item>

            <el-form-item label="會員活動">
              <el-switch 
                v-model="notificationSettings.memberActivity"
                @change="updateNotificationSettings"
              />
              <div class="setting-description">
                新會員註冊、會員升級等通知
              </div>
            </el-form-item>

            <el-form-item label="財務報表">
              <el-switch 
                v-model="notificationSettings.financialReports"
                @change="updateNotificationSettings"
              />
              <div class="setting-description">
                每日/週/月財務報表推送
              </div>
            </el-form-item>
          </el-form>

          <h3>推送頻率</h3>
          <el-form label-width="140px">
            <el-form-item label="摘要頻率">
              <el-radio-group v-model="notificationSettings.frequency" @change="updateNotificationSettings">
                <el-radio label="realtime">即時</el-radio>
                <el-radio label="daily">每日摘要</el-radio>
                <el-radio label="weekly">每週摘要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 隱私設定 -->
      <el-tab-pane label="隱私設定" name="privacy">
        <div class="settings-section">
          <h3>資料隱私</h3>
          
          <el-form label-width="140px">
            <el-form-item label="資料收集">
              <el-switch 
                v-model="privacySettings.dataCollection"
                @change="updatePrivacySettings"
              />
              <div class="setting-description">
                允許收集使用數據以改善服務
              </div>
            </el-form-item>

            <el-form-item label="分析追蹤">
              <el-switch 
                v-model="privacySettings.analytics"
                @change="updatePrivacySettings"
              />
              <div class="setting-description">
                啟用 Google Analytics 等分析工具
              </div>
            </el-form-item>

            <el-form-item label="個人化廣告">
              <el-switch 
                v-model="privacySettings.personalizedAds"
                @change="updatePrivacySettings"
              />
              <div class="setting-description">
                基於您的使用習慣顯示相關內容
              </div>
            </el-form-item>
          </el-form>

          <h3>資料管理</h3>
          <div class="data-management">
            <el-button type="primary" @click="exportData">
              <el-icon><Download /></el-icon>
              匯出我的資料
            </el-button>
            <el-button type="warning" @click="clearCache">
              <el-icon><Delete /></el-icon>
              清除快取資料
            </el-button>
            <el-button type="danger" @click="deleteAccount">
              <el-icon><Warning /></el-icon>
              刪除帳號
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 偏好設定 -->
      <el-tab-pane label="偏好設定" name="preferences">
        <div class="settings-section">
          <h3>介面設定</h3>
          
          <el-form label-width="140px">
            <el-form-item label="語言">
              <el-select v-model="preferenceSettings.language" @change="updatePreferenceSettings">
                <el-option label="繁體中文" value="zh-TW" />
                <el-option label="簡體中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>

            <el-form-item label="時區">
              <el-select v-model="preferenceSettings.timezone" @change="updatePreferenceSettings">
                <el-option label="台北時間 (GMT+8)" value="Asia/Taipei" />
                <el-option label="香港時間 (GMT+8)" value="Asia/Hong_Kong" />
                <el-option label="新加坡時間 (GMT+8)" value="Asia/Singapore" />
              </el-select>
            </el-form-item>

            <el-form-item label="主題模式">
              <el-radio-group v-model="preferenceSettings.theme" @change="updatePreferenceSettings">
                <el-radio label="auto">跟隨系統</el-radio>
                <el-radio label="light">淺色模式</el-radio>
                <el-radio label="dark">深色模式</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="側邊欄">
              <el-radio-group v-model="preferenceSettings.sidebar" @change="updatePreferenceSettings">
                <el-radio label="expanded">展開</el-radio>
                <el-radio label="collapsed">收起</el-radio>
                <el-radio label="auto">自動</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <h3>預設設定</h3>
          <el-form label-width="140px">
            <el-form-item label="每頁顯示">
              <el-select v-model="preferenceSettings.pageSize" @change="updatePreferenceSettings">
                <el-option label="10 項" :value="10" />
                <el-option label="20 項" :value="20" />
                <el-option label="50 項" :value="50" />
                <el-option label="100 項" :value="100" />
              </el-select>
            </el-form-item>

            <el-form-item label="預設排序">
              <el-select v-model="preferenceSettings.defaultSort" @change="updatePreferenceSettings">
                <el-option label="建立時間 (新到舊)" value="created_desc" />
                <el-option label="建立時間 (舊到新)" value="created_asc" />
                <el-option label="更新時間" value="updated_desc" />
                <el-option label="名稱" value="name_asc" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Delete, Warning } from '@element-plus/icons-vue'

const activeTab = ref('security')

// 安全設定
const securitySettings = reactive({
  twoFactorAuth: false,
  loginNotification: true,
  passwordExpiry: 90
})

// 通知設定
const notificationSettings = reactive({
  systemNotifications: true,
  orderNotifications: true,
  inventoryAlerts: true,
  memberActivity: false,
  financialReports: true,
  frequency: 'daily'
})

// 隱私設定
const privacySettings = reactive({
  dataCollection: true,
  analytics: true,
  personalizedAds: false
})

// 偏好設定
const preferenceSettings = reactive({
  language: 'zh-TW',
  timezone: 'Asia/Taipei',
  theme: 'auto',
  sidebar: 'expanded',
  pageSize: 20,
  defaultSort: 'created_desc'
})

// 登入記錄
const loginHistory = ref([
  {
    time: new Date(Date.now() - 1000 * 60 * 30), // 30分鐘前
    ip: '192.168.1.100',
    device: 'Chrome 瀏覽器',
    location: '台北',
    status: 'success'
  },
  {
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小時前
    ip: '192.168.1.100',
    device: 'Chrome 瀏覽器',
    location: '台北',
    status: 'success'
  },
  {
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    ip: '203.74.123.45',
    device: 'Safari 瀏覽器',
    location: '台中',
    status: 'success'
  }
])

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-TW')
}

// 更新安全設定
const updateTwoFactorAuth = () => {
  ElMessage.success('雙重驗證設定已更新')
}

const updateLoginNotification = () => {
  ElMessage.success('登入提醒設定已更新')
}

const updatePasswordExpiry = () => {
  ElMessage.success('密碼有效期設定已更新')
}

// 更新通知設定
const updateNotificationSettings = () => {
  ElMessage.success('通知設定已更新')
}

// 更新隱私設定
const updatePrivacySettings = () => {
  ElMessage.success('隱私設定已更新')
}

// 更新偏好設定
const updatePreferenceSettings = () => {
  ElMessage.success('偏好設定已更新')
}

// 匯出資料
const exportData = () => {
  ElMessage.info('資料匯出功能開發中...')
}

// 清除快取
const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要清除所有快取資料嗎？此操作不可恢復。',
      '確認清除',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    ElMessage.success('快取資料已清除')
  } catch {
    // 用戶取消操作
  }
}

// 刪除帳號
const deleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '警告：刪除帳號是不可逆的操作，您將失去所有資料。確定要繼續嗎？',
      '危險操作',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    ElMessage.warning('帳號刪除功能暫時關閉')
  } catch {
    // 用戶取消操作
  }
}

onMounted(() => {
  // 載入設定數據
})
</script>

<style scoped>
.account-settings-view {
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

.settings-section {
  padding: 20px;
  max-width: 800px;
}

.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color);
  padding-bottom: 8px;
}

.setting-description {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  margin-top: 4px;
  line-height: 1.4;
}

.data-management {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-table {
  margin-top: 16px;
}
</style>