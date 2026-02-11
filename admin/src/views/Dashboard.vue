<template>
  <div class="dashboard-container">
    <!-- 統計卡片 -->
    <el-row :gutter="24" class="stats-row">
      <el-col :xs="12" :sm="6" :lg="6" v-for="stat in stats" :key="stat.title">
        <div class="stat-card fade-in">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-value" :style="{ color: stat.color }">
                <AnimatedNumber :value="stat.value" :prefix="stat.prefix" />
              </div>
              <div class="stat-label">{{ stat.title }}</div>
            </div>
            <div class="stat-icon" :style="{ backgroundColor: stat.bgColor, color: stat.color }">
              <el-icon :size="24">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
          <div class="stat-change" :class="{ up: stat.change > 0, down: stat.change < 0 }">
            <el-icon :size="12">
              <ArrowUp v-if="stat.change > 0" />
              <ArrowDown v-else />
            </el-icon>
            <span>{{ Math.abs(stat.change) }}% 較昨日</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 圖表區域 -->
    <el-row :gutter="24" class="charts-row">
      <!-- 銷售趨勢圖 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <h3>銷售趨勢（最近7天）</h3>
              <el-button-group size="small">
                <el-button 
                  v-for="period in ['7天', '30天', '90天']" 
                  :key="period"
                  :type="selectedPeriod === period ? 'primary' : ''"
                  @click="selectedPeriod = period"
                >
                  {{ period }}
                </el-button>
              </el-button-group>
            </div>
          </template>
          <SalesChart :data="salesChartData" :height="300" />
        </el-card>
      </el-col>
      
      <!-- 商品分類銷售 -->
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card">
          <template #header>
            <h3>商品分類銷售</h3>
          </template>
          <CategoryChart :data="categoryChartData" :height="300" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新訂單和熱銷商品 -->
    <el-row :gutter="24" class="tables-row">
      <!-- 最新訂單 -->
      <el-col :xs="24" :lg="14">
        <el-card class="table-card">
          <template #header>
            <div class="table-header">
              <h3>最新訂單</h3>
              <el-button 
                type="primary" 
                size="small" 
                @click="$router.push('/orders')"
              >
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="recentOrders" stripe>
            <el-table-column prop="orderNumber" label="訂單編號" width="140" />
            <el-table-column prop="customer" label="客戶" width="100" />
            <el-table-column prop="amount" label="金額" width="100">
              <template #default="{ row }">
                <span class="amount">${{ row.amount.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="狀態" width="100">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.status)">
                  {{ getOrderStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="時間" width="140">
              <template #default="{ row }">
                {{ formatTime(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 熱銷商品 -->
      <el-col :xs="24" :lg="10">
        <el-card class="table-card">
          <template #header>
            <h3>熱銷商品 TOP 5</h3>
          </template>
          <div class="top-products">
            <div 
              v-for="(product, index) in topProducts" 
              :key="product.id"
              class="top-product-item"
            >
              <div class="product-rank">{{ index + 1 }}</div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-sales">銷售: {{ product.sales }} 件</div>
              </div>
              <div class="product-amount">
                ${{ product.amount.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  ShoppingBag, TrendCharts, Clock, UserFilled,
  ArrowUp, ArrowDown 
} from '@element-plus/icons-vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import SalesChart from '@/components/charts/SalesChart.vue'
import CategoryChart from '@/components/charts/CategoryChart.vue'

// 響應式數據
const selectedPeriod = ref('7天')
const stats = ref([
  {
    title: '今日訂單',
    value: 48,
    prefix: '',
    change: 12.5,
    icon: ShoppingBag,
    color: '#00d4ff',
    bgColor: 'rgba(0, 212, 255, 0.2)'
  },
  {
    title: '今日營業額',
    value: 125430,
    prefix: '$',
    change: 8.3,
    icon: TrendCharts,
    color: '#00ffaa',
    bgColor: 'rgba(0, 255, 170, 0.2)'
  },
  {
    title: '待處理訂單',
    value: 12,
    prefix: '',
    change: -3.2,
    icon: Clock,
    color: '#ffaa00',
    bgColor: 'rgba(255, 170, 0, 0.2)'
  },
  {
    title: '會員總數',
    value: 1234,
    prefix: '',
    change: 5.7,
    icon: UserFilled,
    color: '#8a2be2',
    bgColor: 'rgba(138, 43, 226, 0.2)'
  }
])

// 圖表數據
const salesChartData = ref({
  labels: ['1/9', '1/10', '1/11', '1/12', '1/13', '1/14', '1/15'],
  datasets: [
    {
      label: '銷售額',
      data: [12500, 15200, 13800, 16900, 14300, 18200, 19500],
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const categoryChartData = ref({
  labels: ['水晶手鍊', '晶礦戒指', '晶礦耳飾', '晶礦項鍊', '原礦擺件', '淨化商品'],
  datasets: [
    {
      data: [35, 25, 15, 12, 8, 5],
      backgroundColor: [
        '#00d4ff',
        '#00ffaa',
        '#ffaa00',
        '#8a2be2',
        '#ff6b6b',
        '#4ecdc4'
      ]
    }
  ]
})

// 最新訂單數據
const recentOrders = ref([
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    customer: '王小明',
    amount: 5998,
    status: 'completed',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    customer: '李小華',
    amount: 1599,
    status: 'processing',
    createdAt: '2024-01-15T13:20:00Z'
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    customer: '張大偉',
    amount: 899,
    status: 'pending',
    createdAt: '2024-01-15T12:10:00Z'
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    customer: '陳美玲',
    amount: 699,
    status: 'completed',
    createdAt: '2024-01-15T11:05:00Z'
  },
  {
    id: 5,
    orderNumber: 'ORD-2024-005',
    customer: '林志明',
    amount: 897,
    status: 'processing',
    createdAt: '2024-01-15T10:45:00Z'
  }
])

// 熱銷商品數據
const topProducts = ref([
  { id: 1, name: '紫水晶能量手鍊', sales: 234, amount: 299120 },
  { id: 2, name: '粉晶愛情手鍊', sales: 189, amount: 185220 },
  { id: 3, name: '黑曜石防護手鍊', sales: 156, amount: 246480 },
  { id: 4, name: '月光石戒指', sales: 142, amount: 337960 },
  { id: 5, name: '海藍寶石戒指', sales: 128, amount: 419840 }
])

// 工具函數
const getOrderStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    processing: '處理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命週期
onMounted(() => {
  // 這裡可以加載真實數據
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 212, 255, 0.2);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-green));
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.stat-change.up {
  color: var(--success);
}

.stat-change.down {
  color: var(--error);
}

.charts-row,
.tables-row {
  margin-bottom: 24px;
}

.chart-card,
.table-card {
  background: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
  backdrop-filter: blur(10px) !important;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.amount {
  color: var(--neon-green);
  font-weight: 600;
}

.top-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 212, 255, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.top-product-item:hover {
  background: rgba(0, 212, 255, 0.1);
  transform: translateX(4px);
}

.product-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.product-info {
  flex: 1;
}

.product-name {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.product-sales {
  color: var(--text-secondary);
  font-size: 12px;
}

.product-amount {
  color: var(--neon-green);
  font-weight: 600;
  font-size: 14px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .stat-value {
    font-size: 24px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>