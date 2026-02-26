<template>
  <div class="orders-view">
    <div class="view-header">
      <h1>訂單管理</h1>
      <div class="header-actions">
        <el-button @click="exportOrders">
          <el-icon><Download /></el-icon>
          匯出報表
        </el-button>
      </div>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="search-filters">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜尋訂單編號或客戶"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select 
            v-model="statusFilter" 
            placeholder="訂單狀態" 
            clearable
            @change="handleSearch"
          >
            <el-option label="全部狀態" value="" />
            <el-option label="待付款" value="pending" />
            <el-option label="已付款" value="paid" />
            <el-option label="處理中" value="processing" />
            <el-option label="已出貨" value="shipped" />
            <el-option label="已送達" value="delivered" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="handleSearch"
          />
        </el-col>
        <el-col :span="5">
          <el-input-number
            v-model="minAmount"
            placeholder="最小金額"
            :min="0"
            controls-position="right"
            style="width: 100%"
            @change="handleSearch"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 統計卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">總訂單數</div>
            </div>
            <el-icon class="stat-icon"><Document /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">${{ stats.revenue.toLocaleString() }}</div>
              <div class="stat-label">總收入</div>
            </div>
            <el-icon class="stat-icon"><Money /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待處理</div>
            </div>
            <el-icon class="stat-icon"><Clock /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">${{ stats.avgOrder }}</div>
              <div class="stat-label">平均訂單金額</div>
            </div>
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 訂單列表 -->
    <div class="orders-table">
      <el-table 
        :data="filteredOrders" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="orderNumber" label="訂單編號" width="170" show-overflow-tooltip>
          <template #default="scope">
            <span class="order-number">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客戶姓名" width="120" show-overflow-tooltip />
        <el-table-column prop="customerEmail" label="客戶信箱" width="200" show-overflow-tooltip />
        <el-table-column prop="totalAmount" label="訂單金額" width="130">
          <template #default="scope">
            <span class="amount-text">${{ scope.row.totalAmount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下單時間" width="160">
          <template #default="scope">
            <span class="date-text">{{ formatDate(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-dropdown @command="handleAction" trigger="click">
              <el-button size="small" type="primary">
                操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="`view-${scope.row.id}`">
                    <el-icon><View /></el-icon>
                    查看詳情
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="`ship-${scope.row.id}`" 
                    v-if="scope.row.status === 'paid'"
                    divided
                  >
                    <el-icon><Van /></el-icon>
                    標記出貨
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="`complete-${scope.row.id}`" 
                    v-if="scope.row.status === 'processing'"
                  >
                    <el-icon><Check /></el-icon>
                    標記完成
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="`cancel-${scope.row.id}`" 
                    v-if="scope.row.status !== 'cancelled' && scope.row.status !== 'delivered'"
                    divided
                  >
                    <el-icon><Close /></el-icon>
                    取消訂單
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分頁 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 訂單詳情對話框 -->
    <el-dialog v-model="showOrderDialog" title="訂單詳情" width="1000px">
      <OrderDetail :order="currentOrder" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Search, Document, Money, Clock, TrendCharts, ArrowDown, View, Van, Check, Close } from '@element-plus/icons-vue'
import OrderDetail from '@/components/OrderDetail.vue'
import { apiRequest } from '@/utils/api'

// 響應式數據
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const minAmount = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showOrderDialog = ref(false)
const currentOrder = ref(null)

// 統計數據
const stats = ref({
  total: 0,
  revenue: 0,
  pending: 0,
  avgOrder: 0
})

// 訂單數據
const orders = ref([])

// 計算屬性
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  if (minAmount.value) {
    filtered = filtered.filter(order => order.totalAmount >= minAmount.value)
  }

  return filtered
})

// 方法
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'success',
    processing: 'primary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    processing: '處理中',
    shipped: '已出貨',
    delivered: '已送達',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewOrder = (order) => {
  currentOrder.value = order
  showOrderDialog.value = true
}

// 處理下拉選單操作
const handleAction = async (command) => {
  const [action, orderId] = command.split('-')
  const order = orders.value.find(o => o.id === orderId)
  
  if (!order) {
    ElMessage.error('找不到對應的訂單')
    return
  }
  
  switch (action) {
    case 'view':
      viewOrder(order)
      break
    case 'ship':
      await shipOrder(order)
      break
    case 'complete':
      await completeOrder(order)
      break
    case 'cancel':
      await cancelOrder(order)
      break
  }
}

// 標記出貨
const shipOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `確定要將訂單 ${order.orderNumber} 標記為已出貨嗎？`,
      '確認出貨',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    order.status = 'shipped'
    ElMessage.success('訂單已標記為已出貨')
  } catch {
    // 用戶取消操作
  }
}

// 標記完成
const completeOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `確定要將訂單 ${order.orderNumber} 標記為已完成嗎？`,
      '確認完成',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'success',
      }
    )
    
    order.status = 'delivered'
    ElMessage.success('訂單已標記為已完成')
  } catch {
    // 用戶取消操作
  }
}

const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `確定要取消訂單 ${order.orderNumber} 嗎？`,
      '確認取消',
      {
        confirmButtonText: '確定取消',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    order.status = 'cancelled'
    ElMessage.success('訂單已取消')
  } catch {
    // 用戶取消操作
  }
}

const exportOrders = () => {
  ElMessage.info('匯出功能開發中')
}

// 搜尋防抖
let searchTimer = null
const handleSearch = () => {
  // 清除之前的定時器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 設置新的定時器，延遲300ms執行搜尋
  searchTimer = setTimeout(() => {
    loadOrders()
  }, 300)
}

// 更新統計資料
const updateStats = () => {
  const totalOrders = orders.value.length
  const totalRevenue = orders.value
    .filter(order => ['paid', 'processing', 'shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0)
  const pendingOrders = orders.value.filter(order => order.status === 'pending').length
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  stats.value = {
    total: totalOrders,
    revenue: Math.round(totalRevenue),
    pending: pendingOrders,
    avgOrder
  }
}

// 載入訂單資料
const loadOrders = async () => {
  try {
    loading.value = true
    const response = await apiRequest('/orders')
    const data = await response.json()
    
    if (data.success) {
      // 轉換 API 資料格式以符合前端需求
      orders.value = data.data.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.user.lastName}${order.user.firstName}`,
        customerEmail: order.user.email,
        totalAmount: parseFloat(order.totalAmount),
        status: order.status.toLowerCase(),
        createdAt: order.createdAt,
        items: order.items || []
      }))
      total.value = data.pagination?.totalCount || orders.value.length
      
      // 計算統計資料
      updateStats()
    } else {
      console.error('Failed to load orders:', data.message)
      orders.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    orders.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 載入統計資料
const loadStats = async () => {
  try {
    const response = await apiRequest('/orders/stats')
    const data = await response.json()
    
    if (data.success) {
      stats.value = data.data || stats.value
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(() => {
  loadOrders()
  loadStats()
})
</script>

<style scoped>
.orders-view {
  padding: 24px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.search-filters {
  background: var(--el-bg-color-page);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-content {
  z-index: 2;
  position: relative;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.stat-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  color: var(--el-color-primary);
  opacity: 0.2;
}

.orders-table {
  background: var(--el-bg-color-page);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.order-number {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.amount-text {
  font-weight: 600;
  color: var(--el-color-success);
}

.date-text {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

</style>