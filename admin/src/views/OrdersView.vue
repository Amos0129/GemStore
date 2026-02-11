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
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="訂單狀態" clearable>
            <el-option label="全部狀態" value="" />
            <el-option label="待付款" value="pending" />
            <el-option label="已付款" value="paid" />
            <el-option label="處理中" value="processing" />
            <el-option label="已出貨" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-col>
        <el-col :span="6">
          <el-input-number
            v-model="minAmount"
            placeholder="最小金額"
            :min="0"
            controls-position="right"
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
        <el-table-column type="index" width="50" />
        <el-table-column prop="orderNumber" label="訂單編號" width="150" />
        <el-table-column prop="customerName" label="客戶姓名" width="120" />
        <el-table-column prop="customerEmail" label="客戶信箱" min-width="180" />
        <el-table-column prop="totalAmount" label="訂單金額" width="120">
          <template #default="scope">
            ${{ scope.row.totalAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下單時間" width="160">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="viewOrder(scope.row)"
            >
              查看
            </el-button>
            <el-dropdown @command="handleAction">
              <el-button size="small">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="`edit-${scope.row.id}`">編輯</el-dropdown-item>
                  <el-dropdown-item :command="`ship-${scope.row.id}`" v-if="scope.row.status === 'paid'">出貨</el-dropdown-item>
                  <el-dropdown-item :command="`cancel-${scope.row.id}`" v-if="scope.row.status !== 'cancelled'">取消</el-dropdown-item>
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
import { Download, Search, Document, Money, Clock, TrendCharts, ArrowDown } from '@element-plus/icons-vue'
import OrderDetail from '@/components/OrderDetail.vue'

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
  total: 156,
  revenue: 328500,
  pending: 12,
  avgOrder: 2108
})

// 模擬訂單數據
const orders = ref([
  {
    id: 1,
    orderNumber: 'ORD20240001',
    customerName: '陳美玲',
    customerEmail: 'chen@example.com',
    totalAmount: 2800,
    status: 'paid',
    createdAt: '2024-02-08T10:30:00Z'
  },
  {
    id: 2,
    orderNumber: 'ORD20240002',
    customerName: '李志明',
    customerEmail: 'lee@example.com',
    totalAmount: 1680,
    status: 'pending',
    createdAt: '2024-02-08T14:15:00Z'
  },
  {
    id: 3,
    orderNumber: 'ORD20240003',
    customerName: '王小華',
    customerEmail: 'wang@example.com',
    totalAmount: 4200,
    status: 'shipped',
    createdAt: '2024-02-07T16:45:00Z'
  }
])

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
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    processing: '處理中',
    shipped: '已出貨',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW')
}

const viewOrder = (order) => {
  currentOrder.value = order
  showOrderDialog.value = true
}

const handleAction = (command) => {
  const [action, orderId] = command.split('-')
  const order = orders.value.find(o => o.id === parseInt(orderId))
  
  switch (action) {
    case 'edit':
      editOrder(order)
      break
    case 'ship':
      shipOrder(order)
      break
    case 'cancel':
      cancelOrder(order)
      break
  }
}

const editOrder = (order) => {
  ElMessage.info('編輯訂單功能開發中')
}

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

onMounted(() => {
  // 載入訂單數據
  total.value = orders.value.length
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
</style>