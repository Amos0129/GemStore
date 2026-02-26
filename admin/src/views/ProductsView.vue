<template>
  <div class="products-view">
    <div class="view-header">
      <h1>商品管理</h1>
      <div class="header-actions">
        <!-- 批量操作按鈕 -->
        <div class="batch-actions" v-if="selectedProducts.length > 0">
          <span class="selected-count">已選擇 {{ selectedProducts.length }} 個商品</span>
          <el-button 
            size="small" 
            type="success" 
            @click="batchToggleStatus('active')"
          >
            批量上架
          </el-button>
          <el-button 
            size="small" 
            type="warning" 
            @click="batchToggleStatus('inactive')"
          >
            批量下架
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="batchDelete"
          >
            批量刪除
          </el-button>
        </div>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          新增商品
        </el-button>
      </div>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="search-filters">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜尋商品名稱或編號"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="categoryFilter" placeholder="選擇分類" clearable>
            <el-option label="全部分類" value="" />
            <el-option label="項鍊" value="necklace" />
            <el-option label="手鍊" value="bracelet" />
            <el-option label="戒指" value="ring" />
            <el-option label="耳環" value="earring" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="選擇狀態" clearable>
            <el-option label="全部狀態" value="" />
            <el-option label="上架中" value="active" />
            <el-option label="已下架" value="inactive" />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 商品列表 -->
    <div class="products-table">
      <el-table 
        ref="productTable"
        :data="filteredProducts" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="編號" width="80">
          <template #default="scope">
            <span class="product-id">{{ scope.row.id.slice(-4) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="圖片" width="70">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              :alt="scope.row.name"
              style="width: 40px; height: 40px; border-radius: 4px;"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名稱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="category" label="分類" width="80">
          <template #default="scope">
            <el-tag size="small">{{ getCategoryName(scope.row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="價格" width="90">
          <template #default="scope">
            <span class="price-text">${{ scope.row.price.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="庫存" width="70">
          <template #default="scope">
            <span :class="{ 'low-stock': scope.row.stock < 10 }">
              {{ scope.row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="80">
          <template #default="scope">
            <el-tag 
              size="small" 
              :type="scope.row.status === 'active' ? 'success' : 'danger'"
            >
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div class="action-buttons">
              <el-button 
                size="small" 
                type="primary" 
                @click="editProduct(scope.row)"
              >
                編輯
              </el-button>
              <el-button 
                size="small" 
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                @click="toggleStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '下架' : '上架' }}
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteProduct(scope.row)"
              >
                刪除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增商品對話框 -->
    <el-dialog v-model="showAddDialog" title="新增商品" width="800px">
      <ProductForm 
        ref="productForm"
        @save="handleSave"
        @cancel="showAddDialog = false"
      />
    </el-dialog>

    <!-- 編輯商品對話框 -->
    <el-dialog v-model="showEditDialog" title="編輯商品" width="800px">
      <ProductForm 
        ref="editProductForm"
        :product="currentProduct"
        @save="handleUpdate"
        @cancel="showEditDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import ProductForm from '@/components/ProductForm.vue'
import adminApi from '@/api/index.js'

// 響應式數據
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentProduct = ref(null)
const selectedProducts = ref([])
const productTable = ref(null)

// 商品數據
const products = ref([])

// 計算屬性
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  return filtered
})

// 方法
const getCategoryName = (category) => {
  const categoryMap = {
    necklace: '項鍊',
    bracelet: '手鍊',
    ring: '戒指',
    earring: '耳環'
  }
  return categoryMap[category] || category
}

const handleSearch = () => {
  // 搜尋邏輯
}

const editProduct = (product) => {
  currentProduct.value = { ...product }
  showEditDialog.value = true
}

// 處理多選變化
const handleSelectionChange = (selection) => {
  selectedProducts.value = selection
}

// 批量狀態切換
const batchToggleStatus = async (newStatus) => {
  if (selectedProducts.value.length === 0) return
  
  try {
    const action = newStatus === 'active' ? '上架' : '下架'
    await ElMessageBox.confirm(
      `確定要${action}選中的 ${selectedProducts.value.length} 個商品嗎？`,
      `批量${action}`,
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const count = selectedProducts.value.length
    selectedProducts.value.forEach(product => {
      product.status = newStatus
    })
    
    // 清除選擇並清空表格勾選狀態
    selectedProducts.value = []
    // 通過 ref 清除表格選擇狀態
    if (productTable.value) {
      productTable.value.clearSelection()
    }
    
    ElMessage.success(`已批量${action} ${count} 個商品`)
  } catch {
    // 用戶取消操作
  }
}

// 批量刪除
const batchDelete = async () => {
  if (selectedProducts.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `確定要刪除選中的 ${selectedProducts.value.length} 個商品嗎？此操作不可恢復。`,
      '批量刪除',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const selectedIds = selectedProducts.value.map(p => p.id)
    products.value = products.value.filter(p => !selectedIds.includes(p.id))
    
    // 清除選擇並清空表格勾選狀態
    selectedProducts.value = []
    // 通過 ref 清除表格選擇狀態
    if (productTable.value) {
      productTable.value.clearSelection()
    }
    
    ElMessage.success(`已批量刪除 ${selectedIds.length} 個商品`)
  } catch {
    // 用戶取消操作
  }
}

const toggleStatus = async (product) => {
  try {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? '上架' : '下架'
    
    await ElMessageBox.confirm(
      `確定要${action}商品「${product.name}」嗎？`,
      '確認操作',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    product.status = newStatus
    ElMessage.success(`商品已${action}`)
  } catch {
    // 用戶取消操作
  }
}

const deleteProduct = async (product) => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除商品「${product.name}」嗎？此操作不可恢復。`,
      '確認刪除',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const index = products.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      products.value.splice(index, 1)
      ElMessage.success('商品已刪除')
    }
  } catch {
    // 用戶取消操作
  }
}

const handleSave = (productData) => {
  // 新增商品邏輯
  const newProduct = {
    ...productData,
    id: `P${String(products.value.length + 1).padStart(3, '0')}`,
    status: 'active'
  }
  
  products.value.push(newProduct)
  showAddDialog.value = false
  ElMessage.success('商品新增成功')
}

const handleUpdate = (productData) => {
  // 更新商品邏輯
  const index = products.value.findIndex(p => p.id === currentProduct.value.id)
  if (index > -1) {
    products.value[index] = { ...productData, id: currentProduct.value.id }
    showEditDialog.value = false
    ElMessage.success('商品更新成功')
  }
}

// 載入商品數據
const loadProducts = async () => {
  try {
    loading.value = true
    // 使用普通的 API 而不是 admin API
    const response = await fetch('http://localhost:5000/api/products')
    const data = await response.json()
    
    if (data.success) {
      products.value = data.data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category?.slug || 'unknown',
        price: parseFloat(product.price),
        stock: product.stock,
        status: product.isActive ? 'active' : 'inactive',
        image: product.images?.[0]?.url || ''
      }))
    }
  } catch (error) {
    console.error('載入商品失敗:', error)
    ElMessage.error('載入商品數據失敗')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.products-view {
  padding: 24px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-hover);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.selected-count {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
  margin-right: 8px;
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

.products-table {
  background: var(--el-bg-color-page);
  padding: 20px;
  border-radius: 8px;
}

.low-stock {
  color: var(--el-color-danger);
  font-weight: bold;
}

.product-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.price-text {
  font-weight: 600;
  color: var(--el-color-success);
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0 !important;
}
</style>