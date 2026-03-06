<template>
  <div class="member-detail" v-if="member">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card title="基本資訊">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="會員ID">{{ member.id }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ member.name }}</el-descriptions-item>
            <el-descriptions-item label="信箱">{{ member.email }}</el-descriptions-item>
            <el-descriptions-item label="電話">{{ member.phone }}</el-descriptions-item>
            <el-descriptions-item label="會員等級">
              <el-tag :type="getLevelType(member.level)">
                {{ getLevelText(member.level) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="註冊時間">
              {{ formatDate(member.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="狀態">
              <el-tag :type="member.status === 'active' ? 'success' : 'danger'">
                {{ member.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card title="消費統計">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="累計消費">
              ${{ member.totalSpent.toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="訂單數量">{{ member.orderCount }}</el-descriptions-item>
            <el-descriptions-item label="平均消費">
              ${{ Math.round(member.totalSpent / Math.max(member.orderCount, 1)).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="最後消費">2024-02-08</el-descriptions-item>
            <el-descriptions-item label="累計點數">1,580</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-divider>購物車內容</el-divider>
        
        <el-card v-loading="cartLoading">
          <template #header v-if="cartData.items && cartData.items.length > 0">
            <div class="cart-header">
              <span>購物車 ({{ cartData.totalItems }} 件商品)</span>
              <span class="cart-total">總計：NT$ {{ cartData.totalAmount?.toLocaleString() }}</span>
            </div>
          </template>
          
          <div v-if="cartData.items && cartData.items.length > 0" class="cart-items">
            <div 
              v-for="item in cartData.items" 
              :key="item.id"
              class="cart-item"
            >
              <img 
                :src="item.product.image || '/placeholder.jpg'" 
                :alt="item.product.name"
                class="item-image"
              />
              <div class="item-info">
                <div class="item-name">{{ item.product.name }}</div>
                <div class="item-details">
                  {{ item.quantity }}x NT$ {{ item.product.price?.toLocaleString() }}
                  = NT$ {{ item.subtotal?.toLocaleString() }}
                </div>
                <div class="item-category">{{ item.product.category }}</div>
              </div>
            </div>
          </div>
          
          <el-empty v-else description="購物車是空的" />
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-divider>最近訂單</el-divider>
        
        <el-table :data="recentOrders" style="width: 100%">
          <el-table-column prop="orderNumber" label="訂單編號" />
          <el-table-column prop="amount" label="金額">
            <template #default="scope">
              NT$ {{ scope.row.amount?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="狀態">
            <template #default="scope">
              <el-tag :type="getOrderStatusType(scope.row.status)">
                {{ getOrderStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="下單時間">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

// 購物車數據
const cartData = ref({
  items: [],
  totalItems: 0,
  totalAmount: 0
})
const cartLoading = ref(false)

// 獲取用戶購物車數據
const fetchUserCart = async () => {
  if (!props.member?.id) return
  
  try {
    cartLoading.value = true
    console.log('Fetching cart for user:', props.member.id)
    
    const token = localStorage.getItem('admin_token') // 確保使用正確的token
    const response = await fetch(`http://localhost:5000/api/admin/carts?userId=${props.member.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Cart API response status:', response.status)
    const data = await response.json()
    console.log('Cart API response data:', data)
    
    if (data.success && data.data.carts.length > 0) {
      const userCart = data.data.carts[0] // 取第一個（應該只有一個用戶的數據）
      cartData.value = {
        items: userCart.items,
        totalItems: userCart.totalItems,
        totalAmount: userCart.totalAmount
      }
      console.log('Cart data set:', cartData.value)
    } else {
      console.log('No cart data found for user')
      cartData.value = {
        items: [],
        totalItems: 0,
        totalAmount: 0
      }
    }
  } catch (error) {
    console.error('獲取購物車數據失敗:', error)
    cartData.value = {
      items: [],
      totalItems: 0,
      totalAmount: 0
    }
  } finally {
    cartLoading.value = false
  }
}

// 監聽 member 變化
watch(() => props.member?.id, (newId) => {
  if (newId) {
    fetchUserCart()
  }
}, { immediate: true })

// 模擬最近訂單
const recentOrders = computed(() => [
  {
    orderNumber: 'ORD20240001',
    amount: 2800,
    status: 'completed',
    createdAt: '2024-02-08T10:30:00Z'
  },
  {
    orderNumber: 'ORD20240002',
    amount: 1680,
    status: 'shipped',
    createdAt: '2024-02-05T14:15:00Z'
  }
])

const getLevelType = (level) => {
  const levelMap = {
    bronze: 'info',
    silver: 'warning',
    gold: 'success',
    platinum: 'danger'
  }
  return levelMap[level] || 'info'
}

const getLevelText = (level) => {
  const levelMap = {
    bronze: '一般會員',
    silver: '銀級會員',
    gold: '金級會員',
    platinum: '白金會員'
  }
  return levelMap[level] || level
}

const getOrderStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'success',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已出貨',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.member-detail {
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.cart-total {
  color: var(--el-color-primary);
  font-size: 16px;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 12px;
  border: 1px solid var(--el-border-color-light);
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  font-size: 14px;
}

.item-details {
  color: var(--el-color-primary);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.item-category {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .item-image {
    width: 48px;
    height: 48px;
  }
  
  .item-name {
    font-size: 13px;
  }
  
  .item-details {
    font-size: 12px;
  }
}
</style>