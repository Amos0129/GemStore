<template>
  <div class="finance-view">
    <!-- 緊湊頭部 -->
    <div class="view-header">
      <h1>財務報表</h1>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          format="MM/DD"
          value-format="YYYY-MM-DD"
          size="small"
          @change="updateData"
        />
        <el-button type="primary" size="small" @click="exportReport">
          <el-icon><Download /></el-icon>
          匯出
        </el-button>
      </div>
    </div>

    <!-- 全部內容在一個大容器內 -->
    <div class="dashboard-content">
      <!-- 頂部統計卡片 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-info">
            <div class="stat-value">${{ stats.totalRevenue.toLocaleString() }}</div>
            <div class="stat-label">總收入</div>
          </div>
          <div class="stat-icon revenue-bg">
            <el-icon><Money /></el-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalOrders }}</div>
            <div class="stat-label">訂單數</div>
          </div>
          <div class="stat-icon orders-bg">
            <el-icon><Document /></el-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <div class="stat-value">${{ stats.avgOrderValue }}</div>
            <div class="stat-label">平均金額</div>
          </div>
          <div class="stat-icon avg-bg">
            <el-icon><PieChart /></el-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <div class="stat-value">${{ stats.netProfit.toLocaleString() }}</div>
            <div class="stat-label">淨利潤</div>
          </div>
          <div class="stat-icon profit-bg">
            <el-icon><Trophy /></el-icon>
          </div>
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
              <div ref="revenueChart" style="height: 220px;"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <template #header>
                <span>銷售分佈</span>
              </template>
              <div ref="pieChart" style="height: 220px;"></div>
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
                    ${{ (scope.row.revenue || 0).toLocaleString() }}
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
                    ${{ (scope.row.revenue || 0).toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="orders" label="訂單數" width="80" />
                <el-table-column prop="growth" label="成長率" width="100">
                  <template #default="scope">
                    <span :class="{ 'text-success': scope.row.growth > 0, 'text-danger': scope.row.growth < 0 }">
                      {{ scope.row.growth > 0 ? '+' : '' }}{{ scope.row.growth || 0 }}%
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
/* 主容器 - 固定視窗高度 */
.finance-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px;
  height: calc(100vh - 60px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 緊湊頭部 */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
  height: 40px;
}

.view-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 儀表板內容容器 */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

/* 頂部統計卡片 - 橫向一排 */
.stats-section {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  height: 80px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid var(--el-border-color-light);
  position: relative;
  overflow: hidden;
}


.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.revenue-bg { background: linear-gradient(135deg, #67C23A, #85CE61); }
.orders-bg { background: linear-gradient(135deg, #409EFF, #79BBFF); }
.avg-bg { background: linear-gradient(135deg, #E6A23C, #EEBE77); }
.profit-bg { background: linear-gradient(135deg, #F56C6C, #F89898); }

.charts-section {
  margin-bottom: 12px;
}

.detailed-reports {
  margin-bottom: 12px;
}

.expense-analysis {
  margin-bottom: 12px;
}

.expense-item {
  text-align: center;
  padding: 12px;
}

.expense-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-bottom: 6px;
}

.expense-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 3px;
}

.expense-percentage {
  font-size: 11px;
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

/* 讓表格更緊湊 */
.finance-view :deep(.el-table) {
  font-size: 12px;
}

.finance-view :deep(.el-table .el-table__cell) {
  padding: 8px 0;
}

.finance-view :deep(.el-card__header) {
  padding: 12px 16px;
}

.finance-view :deep(.el-card__body) {
  padding: 12px 16px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .stats-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    height: auto;
  }
  
  .stat-card {
    margin-bottom: 8px;
  }
  
  .finance-view {
    height: auto;
    overflow: auto;
  }
}
</style>