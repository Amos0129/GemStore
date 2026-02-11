<template>
  <div class="settings-view">
    <div class="view-header">
      <h1>系統設定</h1>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基本設定 -->
      <el-tab-pane label="基本設定" name="basic">
        <div class="settings-section">
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="網站名稱">
              <el-input v-model="basicSettings.siteName" />
            </el-form-item>
            <el-form-item label="網站描述">
              <el-input 
                v-model="basicSettings.siteDescription" 
                type="textarea" 
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="客服電話">
              <el-input v-model="basicSettings.customerServicePhone" />
            </el-form-item>
            <el-form-item label="客服信箱">
              <el-input v-model="basicSettings.customerServiceEmail" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input 
                v-model="basicSettings.companyAddress" 
                type="textarea" 
                :rows="2"
              />
            </el-form-item>
            <el-form-item label="網站Logo">
              <el-upload
                class="logo-uploader"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                action="#"
              >
                <img v-if="basicSettings.logoUrl" :src="basicSettings.logoUrl" class="logo" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存基本設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 商店設定 -->
      <el-tab-pane label="商店設定" name="store">
        <div class="settings-section">
          <el-form :model="storeSettings" label-width="120px">
            <el-form-item label="預設貨幣">
              <el-select v-model="storeSettings.defaultCurrency">
                <el-option label="新台幣 (TWD)" value="TWD" />
                <el-option label="美元 (USD)" value="USD" />
                <el-option label="歐元 (EUR)" value="EUR" />
              </el-select>
            </el-form-item>
            <el-form-item label="免運費門檻">
              <el-input-number 
                v-model="storeSettings.freeShippingThreshold" 
                :min="0" 
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="運費">
              <el-input-number 
                v-model="storeSettings.shippingFee" 
                :min="0" 
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="稅率 (%)">
              <el-input-number 
                v-model="storeSettings.taxRate" 
                :min="0" 
                :max="100"
                :precision="2"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="庫存警告數量">
              <el-input-number 
                v-model="storeSettings.lowStockThreshold" 
                :min="0" 
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="訂單自動確認">
              <el-switch v-model="storeSettings.autoConfirmOrders" />
            </el-form-item>
            <el-form-item label="允許訪客結帳">
              <el-switch v-model="storeSettings.allowGuestCheckout" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveStoreSettings">保存商店設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 付款設定 -->
      <el-tab-pane label="付款設定" name="payment">
        <div class="settings-section">
          <el-form :model="paymentSettings" label-width="120px">
            <el-form-item label="支付方式">
              <el-checkbox-group v-model="paymentSettings.methods">
                <el-checkbox label="credit_card">信用卡</el-checkbox>
                <el-checkbox label="bank_transfer">銀行轉帳</el-checkbox>
                <el-checkbox label="paypal">PayPal</el-checkbox>
                <el-checkbox label="cash_on_delivery">貨到付款</el-checkbox>
                <el-checkbox label="line_pay">LINE Pay</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="信用卡手續費 (%)">
              <el-input-number 
                v-model="paymentSettings.creditCardFee" 
                :min="0" 
                :max="10"
                :precision="2"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="PayPal手續費 (%)">
              <el-input-number 
                v-model="paymentSettings.paypalFee" 
                :min="0" 
                :max="10"
                :precision="2"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="銀行帳號">
              <el-input v-model="paymentSettings.bankAccount" />
            </el-form-item>
            <el-form-item label="銀行名稱">
              <el-input v-model="paymentSettings.bankName" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="savePaymentSettings">保存付款設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 物流設定 -->
      <el-tab-pane label="物流設定" name="shipping">
        <div class="settings-section">
          <el-form :model="shippingSettings" label-width="120px">
            <el-form-item label="配送方式">
              <el-checkbox-group v-model="shippingSettings.methods">
                <el-checkbox label="home_delivery">宅配</el-checkbox>
                <el-checkbox label="convenience_store">超商取貨</el-checkbox>
                <el-checkbox label="post_office">郵局取貨</el-checkbox>
                <el-checkbox label="self_pickup">自取</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="宅配費用">
              <el-input-number 
                v-model="shippingSettings.homeDeliveryFee" 
                :min="0" 
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="超商取貨費用">
              <el-input-number 
                v-model="shippingSettings.convenienceStoreFee" 
                :min="0" 
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="預計出貨天數">
              <el-input-number 
                v-model="shippingSettings.estimatedDays" 
                :min="1" 
                :max="30"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="退換貨期限 (天)">
              <el-input-number 
                v-model="shippingSettings.returnDays" 
                :min="1" 
                :max="30"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveShippingSettings">保存物流設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 通知設定 -->
      <el-tab-pane label="通知設定" name="notifications">
        <div class="settings-section">
          <el-form :model="notificationSettings" label-width="140px">
            <el-form-item label="新訂單通知">
              <el-switch v-model="notificationSettings.newOrder" />
            </el-form-item>
            <el-form-item label="低庫存警告">
              <el-switch v-model="notificationSettings.lowStock" />
            </el-form-item>
            <el-form-item label="會員註冊通知">
              <el-switch v-model="notificationSettings.newMember" />
            </el-form-item>
            <el-form-item label="評價通知">
              <el-switch v-model="notificationSettings.newReview" />
            </el-form-item>
            <el-form-item label="通知信箱">
              <el-input v-model="notificationSettings.email" />
            </el-form-item>
            <el-form-item label="LINE Notify Token">
              <el-input 
                v-model="notificationSettings.lineToken" 
                type="password" 
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNotificationSettings">保存通知設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- SEO設定 -->
      <el-tab-pane label="SEO設定" name="seo">
        <div class="settings-section">
          <el-form :model="seoSettings" label-width="120px">
            <el-form-item label="網站標題">
              <el-input v-model="seoSettings.title" />
            </el-form-item>
            <el-form-item label="Meta描述">
              <el-input 
                v-model="seoSettings.description" 
                type="textarea" 
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="關鍵字">
              <el-input 
                v-model="seoSettings.keywords" 
                placeholder="以逗號分隔"
              />
            </el-form-item>
            <el-form-item label="Google Analytics">
              <el-input v-model="seoSettings.googleAnalytics" />
            </el-form-item>
            <el-form-item label="Facebook Pixel">
              <el-input v-model="seoSettings.facebookPixel" />
            </el-form-item>
            <el-form-item label="Google Tag Manager">
              <el-input v-model="seoSettings.googleTagManager" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSeoSettings">保存SEO設定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 系統資訊 -->
      <el-tab-pane label="系統資訊" name="system">
        <div class="settings-section">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="系統版本">{{ systemInfo.version }}</el-descriptions-item>
            <el-descriptions-item label="資料庫版本">{{ systemInfo.database }}</el-descriptions-item>
            <el-descriptions-item label="PHP版本">{{ systemInfo.php }}</el-descriptions-item>
            <el-descriptions-item label="伺服器">{{ systemInfo.server }}</el-descriptions-item>
            <el-descriptions-item label="磁碟空間">{{ systemInfo.disk }}</el-descriptions-item>
            <el-descriptions-item label="記憶體使用">{{ systemInfo.memory }}</el-descriptions-item>
            <el-descriptions-item label="最後備份">{{ systemInfo.lastBackup }}</el-descriptions-item>
            <el-descriptions-item label="運行時間">{{ systemInfo.uptime }}</el-descriptions-item>
          </el-descriptions>
          
          <div style="margin-top: 20px;">
            <el-button type="primary" @click="backupSystem">
              <el-icon><Download /></el-icon>
              立即備份
            </el-button>
            <el-button type="warning" @click="clearCache">
              <el-icon><Delete /></el-icon>
              清除快取
            </el-button>
            <el-button type="danger" @click="restartSystem">
              <el-icon><Refresh /></el-icon>
              重啟系統
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Delete, Refresh } from '@element-plus/icons-vue'

// 響應式數據
const activeTab = ref('basic')

// 基本設定
const basicSettings = ref({
  siteName: '晶礦飾品',
  siteDescription: '精選天然水晶飾品，為您帶來能量與美麗',
  customerServicePhone: '0800-123-456',
  customerServiceEmail: 'service@crystal-jewelry.com',
  companyAddress: '台北市信義區信義路五段7號',
  logoUrl: null
})

// 商店設定
const storeSettings = ref({
  defaultCurrency: 'TWD',
  freeShippingThreshold: 1000,
  shippingFee: 80,
  taxRate: 5.0,
  lowStockThreshold: 10,
  autoConfirmOrders: true,
  allowGuestCheckout: true
})

// 付款設定
const paymentSettings = ref({
  methods: ['credit_card', 'bank_transfer', 'line_pay'],
  creditCardFee: 2.75,
  paypalFee: 3.4,
  bankAccount: '123-456-789-012',
  bankName: '中國信託銀行'
})

// 物流設定
const shippingSettings = ref({
  methods: ['home_delivery', 'convenience_store'],
  homeDeliveryFee: 80,
  convenienceStoreFee: 60,
  estimatedDays: 3,
  returnDays: 7
})

// 通知設定
const notificationSettings = ref({
  newOrder: true,
  lowStock: true,
  newMember: false,
  newReview: true,
  email: 'admin@crystal-jewelry.com',
  lineToken: ''
})

// SEO設定
const seoSettings = ref({
  title: '晶礦飾品 - 精選天然水晶飾品',
  description: '專業水晶飾品購物網站，提供項鍊、手鍊、戒指、耳環等各式天然水晶飾品',
  keywords: '水晶,飾品,項鍊,手鍊,戒指,耳環,天然水晶',
  googleAnalytics: '',
  facebookPixel: '',
  googleTagManager: ''
})

// 系統資訊
const systemInfo = ref({
  version: '1.0.0',
  database: 'MySQL 8.0',
  php: '8.1',
  server: 'Nginx 1.20',
  disk: '15.2 GB / 100 GB',
  memory: '2.1 GB / 8 GB',
  lastBackup: '2024-02-08 10:30:00',
  uptime: '15 天 6 小時'
})

// 方法
const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Logo只能是JPG/PNG格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超過 2MB!')
    return false
  }
  return true
}

const saveBasicSettings = () => {
  ElMessage.success('基本設定保存成功')
}

const saveStoreSettings = () => {
  ElMessage.success('商店設定保存成功')
}

const savePaymentSettings = () => {
  ElMessage.success('付款設定保存成功')
}

const saveShippingSettings = () => {
  ElMessage.success('物流設定保存成功')
}

const saveNotificationSettings = () => {
  ElMessage.success('通知設定保存成功')
}

const saveSeoSettings = () => {
  ElMessage.success('SEO設定保存成功')
}

const backupSystem = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要進行系統備份嗎？備份過程可能需要幾分鐘時間。',
      '確認備份',
      {
        confirmButtonText: '確定備份',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    ElMessage.success('系統備份已開始，請稍候...')
    // 實際備份邏輯
  } catch {
    // 用戶取消操作
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要清除系統快取嗎？這將暫時影響網站性能。',
      '確認清除',
      {
        confirmButtonText: '確定清除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    ElMessage.success('快取清除成功')
    // 實際清除邏輯
  } catch {
    // 用戶取消操作
  }
}

const restartSystem = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要重啟系統嗎？重啟期間網站將暫時無法訪問。',
      '確認重啟',
      {
        confirmButtonText: '確定重啟',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    
    ElMessage.warning('系統重啟中，請稍候...')
    // 實際重啟邏輯
  } catch {
    // 用戶取消操作
  }
}
</script>

<style scoped>
.settings-view {
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

.logo-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.logo {
  width: 120px;
  height: 80px;
  object-fit: contain;
}
</style>