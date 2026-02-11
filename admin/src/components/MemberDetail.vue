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

    <el-divider>最近訂單</el-divider>
    
    <el-table :data="recentOrders" style="width: 100%">
      <el-table-column prop="orderNumber" label="訂單編號" />
      <el-table-column prop="amount" label="金額">
        <template #default="scope">
          ${{ scope.row.amount.toLocaleString() }}
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

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
</style>