<template>
  <div class="products-view">
    <div class="view-header">
      <h1>商品管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
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
        :data="filteredProducts" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="id" label="商品編號" width="120" />
        <el-table-column label="商品圖片" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              :alt="scope.row.name"
              style="width: 60px; height: 60px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名稱" min-width="200" />
        <el-table-column prop="category" label="分類" width="120">
          <template #default="scope">
            <el-tag>{{ getCategoryName(scope.row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="價格" width="120">
          <template #default="scope">
            ${{ scope.row.price.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="庫存" width="100">
          <template #default="scope">
            <span :class="{ 'low-stock': scope.row.stock < 10 }">
              {{ scope.row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '上架中' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
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

// 響應式數據
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentProduct = ref(null)

// 模擬商品數據
const products = ref([
  {
    id: 'P001',
    name: '紫水晶能量項鍊',
    category: 'necklace',
    price: 2800,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200'
  },
  {
    id: 'P002',
    name: '粉晶愛情手鍊',
    category: 'bracelet',
    price: 1680,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584302179602-e4578db5a8c2?w=200'
  },
  {
    id: 'P003',
    name: '白水晶淨化戒指',
    category: 'ring',
    price: 3200,
    stock: 12,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200'
  }
])

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

onMounted(() => {
  // 載入商品數據
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
</style>