<template>
  <div class="finance-view">
    <div class="view-header">
      <h1>財務報表</h1>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          @change="updateData"
        />
        <el-button type="primary" @click="exportReport">
          <el-icon><Download /></el-icon>
          匯出報表
        </el-button>
      </div>
    </div>

    <!-- 關鍵指標卡片 -->
    <div class="stats-overview">
      <div class="stats-grid">
        <el-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-value">${{ stats.totalRevenue.toLocaleString() }}</div>
            <div class="stat-label">總收入</div>
            <div class="stat-change" :class="{ positive: stats.revenueChange > 0 }">
              <el-icon><TrendCharts /></el-icon>
              {{ stats.revenueChange > 0 ? '+' : '' }}{{ stats.revenueChange }}%
            </div>
          </div>
          <el-icon class="stat-icon"><Money /></el-icon>
        </el-card>
        <el-card class="stat-card orders">
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalOrders }}</div>
            <div class="stat-label">總訂單數</div>
            <div class="stat-change" :class="{ positive: stats.ordersChange > 0 }">
              <el-icon><TrendCharts /></el-icon>
              {{ stats.ordersChange > 0 ? '+' : '' }}{{ stats.ordersChange }}%
            </div>
          </div>
          <el-icon class="stat-icon"><Document /></el-icon>
        </el-card>
        <el-card class="stat-card avg-order">
          <div class="stat-content">
            <div class="stat-value">${{ stats.avgOrderValue }}</div>
            <div class="stat-label">平均訂單金額</div>
            <div class="stat-change" :class="{ positive: stats.avgChange > 0 }">
              <el-icon><TrendCharts /></el-icon>
              {{ stats.avgChange > 0 ? '+' : '' }}{{ stats.avgChange }}%
            </div>
          </div>
          <el-icon class="stat-icon"><PieChart /></el-icon>
        </el-card>
        <el-card class="stat-card profit">
          <div class="stat-content">
            <div class="stat-value">${{ stats.netProfit.toLocaleString() }}</div>
            <div class="stat-label">淨利潤</div>
            <div class="stat-change" :class="{ positive: stats.profitChange > 0 }">
              <el-icon><TrendCharts /></el-icon>
              {{ stats.profitChange > 0 ? '+' : '' }}{{ stats.profitChange }}%
            </div>
          </div>
          <el-icon class="stat-icon"><Trophy /></el-icon>
        </el-card>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>收入趨勢</span>
                <el-radio-group v-model="revenueChartType" size="small">
                  <el-radio-button label="daily">日</el-radio-button>
                  <el-radio-button label="weekly">週</el-radio-button>
                  <el-radio-button label="monthly">月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="revenueChart" style="height: 400px;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>銷售分佈</span>
            </template>
            <div ref="pieChart" style="height: 400px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 詳細報表 -->
    <div class="detailed-reports">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>熱銷商品</span>
            </template>
            <el-table :data="topProducts" style="width: 100%">
              <el-table-column prop="name" label="商品名稱" min-width="120" />
              <el-table-column prop="sales" label="銷量" width="80" />
              <el-table-column prop="revenue" label="收入" width="100">
                <template #default="scope">
                  ${{ scope.row.revenue.toLocaleString() }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>月度對比</span>
            </template>
            <el-table :data="monthlyComparison" style="width: 100%">
              <el-table-column prop="month" label="月份" width="80" />
              <el-table-column prop="revenue" label="收入" width="120">
                <template #default="scope">
                  ${{ scope.row.revenue.toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column prop="orders" label="訂單數" width="80" />
              <el-table-column prop="growth" label="成長率" width="100">
                <template #default="scope">
                  <span :class="{ 'text-success': scope.row.growth > 0, 'text-danger': scope.row.growth < 0 }">
                    {{ scope.row.growth > 0 ? '+' : '' }}{{ scope.row.growth }}%
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 支出分析 -->
    <div class="expense-analysis">
      <el-card>
        <template #header>
          <span>支出分析</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="expense-item">
              <div class="expense-label">商品成本</div>
              <div class="expense-value">${{ expenses.productCost.toLocaleString() }}</div>
              <div class="expense-percentage">{{ expenses.productCostPercentage }}%</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="expense-item">
              <div class="expense-label">運營成本</div>
              <div class="expense-value">${{ expenses.operatingCost.toLocaleString() }}</div>
              <div class="expense-percentage">{{ expenses.operatingCostPercentage }}%</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="expense-item">
              <div class="expense-label">行銷費用</div>
              <div class="expense-value">${{ expenses.marketingCost.toLocaleString() }}</div>
              <div class="expense-percentage">{{ expenses.marketingCostPercentage }}%</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Money, Document, PieChart, Trophy, TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 響應式數據
const dateRange = ref([])
const revenueChartType = ref('monthly')
const revenueChart = ref()
const pieChart = ref()

// 統計數據
const stats = ref({
  totalRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  ordersChange: 0,
  avgOrderValue: 0,
  avgChange: 0,
  netProfit: 0,
  profitChange: 0
})

// 熱銷商品
const topProducts = ref([])

// 月度對比
const monthlyComparison = ref([])

// 支出數據
const expenses = ref({
  productCost: 0,
  productCostPercentage: 60,
  operatingCost: 0,
  operatingCostPercentage: 20,
  marketingCost: 0,
  marketingCostPercentage: 10
})

// 載入財務統計
const loadFinanceStats = async () => {
  try {
    const params = new URLSearchParams()
    if (dateRange.value && dateRange.value.length === 2) {
      params.append('startDate', dateRange.value[0])
      params.append('endDate', dateRange.value[1])
    }

    const response = await fetch(`http://localhost:5000/api/admin/finance/stats?${params}`)
    const data = await response.json()
    
    if (data.success) {
      stats.value = data.data
      
      // 計算支出數據
      const totalRevenue = stats.value.totalRevenue
      expenses.value.productCost = Math.round(totalRevenue * 0.4)
      expenses.value.operatingCost = Math.round(totalRevenue * 0.2)
      expenses.value.marketingCost = Math.round(totalRevenue * 0.1)
    }
  } catch (error) {
    console.error('載入財務統計失敗:', error)
  }
}

// 載入熱銷商品
const loadTopProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/finance/top-products')
    const data = await response.json()
    
    if (data.success) {
      topProducts.value = data.data
    }
  } catch (error) {
    console.error('載入熱銷商品失敗:', error)
  }
}

// 載入月度對比
const loadMonthlyComparison = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/finance/monthly-comparison')
    const data = await response.json()
    
    if (data.success) {
      monthlyComparison.value = data.data
    }
  } catch (error) {
    console.error('載入月度對比失敗:', error)
  }
}

// 方法
const updateData = async () => {
  ElMessage.info('數據已更新')
  await loadAllData()
  initCharts()
}

const loadAllData = async () => {
  await Promise.all([
    loadFinanceStats(),
    loadTopProducts(),
    loadMonthlyComparison()
  ])
}

const exportReport = () => {
  ElMessage.success('報表匯出成功')
}

const initRevenueChart = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/finance/revenue-chart?type=monthly')
    const data = await response.json()
    
    const chartDom = revenueChart.value
    const myChart = echarts.init(chartDom)
    
    const option = {
      title: {
        text: '收入趨勢',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['收入', '訂單數'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: data.success ? data.data.labels : []
      },
      yAxis: [
        {
          type: 'value',
          name: '收入 ($)',
          position: 'left'
        },
        {
          type: 'value',
          name: '訂單數',
          position: 'right'
        }
      ],
      series: [
        {
          name: '收入',
          type: 'bar',
          yAxisIndex: 0,
          data: data.success ? data.data.revenue : [],
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          name: '訂單數',
          type: 'line',
          yAxisIndex: 1,
          data: data.success ? data.data.orders : [],
          itemStyle: {
            color: '#67C23A'
          }
        }
      ]
    }
    
    myChart.setOption(option)
  } catch (error) {
    console.error('載入收入圖表失敗:', error)
  }
}

const initPieChart = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/finance/category-distribution')
    const data = await response.json()
    
    const chartDom = pieChart.value
    const myChart = echarts.init(chartDom)
    
    const option = {
      title: {
        text: '銷售分佈',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: '銷售額',
          type: 'pie',
          radius: '50%',
          data: data.success ? data.data : [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    
    myChart.setOption(option)
  } catch (error) {
    console.error('載入銷售分佈圖表失敗:', error)
  }
}

const initCharts = async () => {
  await nextTick()
  await Promise.all([
    initRevenueChart(),
    initPieChart()
  ])
}

onMounted(async () => {
  // 設置默認日期範圍為當前月份
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  dateRange.value = [
    firstDay.toISOString().split('T')[0],
    lastDay.toISOString().split('T')[0]
  ]
  
  await loadAllData()
  await initCharts()
})
</script>

<style scoped>
.finance-view {
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stats-overview {
  margin-bottom: 24px;
}

.stats-overview .el-row {
  display: flex;
  align-items: stretch;
}

.stats-overview .el-col {
  display: flex;
}

.stat-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
}

.stat-card.revenue {
  border-left: 4px solid #67C23A;
}

.stat-card.orders {
  border-left: 4px solid #409EFF;
}

.stat-card.avg-order {
  border-left: 4px solid #E6A23C;
}

.stat-card.profit {
  border-left: 4px solid #F56C6C;
}

.stat-content {
  z-index: 2;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;
  line-height: 1.2;
  min-height: 34px;
  display: flex;
  align-items: center;
}

.stat-label {
  color: var(--el-text-color-regular);
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
  min-height: 20px;
  display: flex;
  align-items: center;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-color-danger);
  min-height: 18px;
}

.stat-change.positive {
  color: var(--el-color-success);
}

.stat-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  color: var(--el-color-primary);
  opacity: 0.1;
}

.charts-section {
  margin-bottom: 24px;
}

.detailed-reports {
  margin-bottom: 24px;
}

.expense-analysis {
  margin-bottom: 24px;
}

.expense-item {
  text-align: center;
  padding: 20px;
}

.expense-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.expense-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.expense-percentage {
  font-size: 12px;
  color: var(--el-color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-success {
  color: var(--el-color-success);
}

.text-danger {
  color: var(--el-color-danger);
}
</style>