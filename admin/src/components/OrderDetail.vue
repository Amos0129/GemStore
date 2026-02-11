<template>
  <div class="order-detail" v-if="order">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="訂單編號">{{ order.orderNumber }}</el-descriptions-item>
      <el-descriptions-item label="下單時間">{{ formatDate(order.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="客戶姓名">{{ order.customerName }}</el-descriptions-item>
      <el-descriptions-item label="客戶信箱">{{ order.customerEmail }}</el-descriptions-item>
      <el-descriptions-item label="訂單狀態">
        <el-tag :type="getStatusType(order.status)">
          {{ getStatusText(order.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="訂單金額">
        ${{ order.totalAmount.toLocaleString() }}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider>商品明細</el-divider>
    
    <el-table :data="orderItems" style="width: 100%">
      <el-table-column prop="name" label="商品名稱" />
      <el-table-column prop="price" label="單價">
        <template #default="scope">
          ${{ scope.row.price.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="數量" />
      <el-table-column prop="subtotal" label="小計">
        <template #default="scope">
          ${{ scope.row.subtotal.toLocaleString() }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

// 模擬訂單商品
const orderItems = computed(() => [
  {
    name: '紫水晶能量項鍊',
    price: 2800,
    quantity: 1,
    subtotal: 2800
  }
])

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
</script>