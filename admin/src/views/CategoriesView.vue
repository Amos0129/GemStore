<template>
  <div class="categories-view">
    <div class="view-header">
      <h1>分類管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        新增分類
      </el-button>
    </div>

    <!-- 分類樹狀結構 -->
    <div class="categories-tree">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>商品分類樹</span>
            <el-button size="small" @click="expandAll">展開全部</el-button>
          </div>
        </template>
        
        <el-tree
          :data="categoriesTree"
          :props="treeProps"
          :default-expand-all="false"
          :expand-on-click-node="false"
          ref="treeRef"
          node-key="id"
          draggable
          @node-drop="handleDrop"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <span class="node-label">
                <el-icon class="node-icon">
                  <component :is="data.icon" />
                </el-icon>
                {{ data.name }}
                <el-tag v-if="data.productCount" size="small" type="info">
                  {{ data.productCount }} 個商品
                </el-tag>
              </span>
              <span class="node-actions">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editCategory(data)"
                >
                  編輯
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="addSubCategory(data)"
                >
                  新增子分類
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteCategory(data)"
                  :disabled="data.productCount > 0"
                >
                  刪除
                </el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 分類列表 -->
    <div class="categories-table">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>分類列表</span>
            <div>
              <el-input
                v-model="searchQuery"
                placeholder="搜尋分類名稱"
                size="small"
                style="width: 200px; margin-right: 10px;"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>
        </template>

        <el-table 
          :data="filteredCategories" 
          style="width: 100%"
          v-loading="loading"
          row-key="id"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="name" label="分類名稱" min-width="200">
            <template #default="scope">
              <el-icon style="margin-right: 8px;">
                <component :is="scope.row.icon" />
              </el-icon>
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="分類代碼" width="150" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column prop="productCount" label="商品數量" width="120">
            <template #default="scope">
              <el-tag type="info">{{ scope.row.productCount || 0 }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="100" />
          <el-table-column prop="status" label="狀態" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="toggleStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button 
                size="small" 
                type="primary" 
                @click="editCategory(scope.row)"
              >
                編輯
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="addSubCategory(scope.row)"
              >
                新增子分類
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteCategory(scope.row)"
                :disabled="scope.row.productCount > 0"
              >
                刪除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增/編輯分類對話框 -->
    <el-dialog 
      v-model="showCategoryDialog" 
      :title="dialogTitle" 
      width="600px"
      @close="resetForm"
    >
      <el-form 
        :model="categoryForm" 
        :rules="formRules" 
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="分類名稱" prop="name">
          <el-input v-model="categoryForm.name" placeholder="請輸入分類名稱" />
        </el-form-item>
        <el-form-item label="分類代碼" prop="code">
          <el-input v-model="categoryForm.code" placeholder="請輸入分類代碼" />
        </el-form-item>
        <el-form-item label="上級分類" prop="parentId">
          <el-tree-select
            v-model="categoryForm.parentId"
            :data="categoriesTree"
            :props="{ label: 'name', value: 'id' }"
            placeholder="請選擇上級分類（可選）"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="圖示" prop="icon">
          <el-select v-model="categoryForm.icon" placeholder="選擇圖示">
            <el-option value="Star" label="寶石">
              <el-icon style="margin-right: 8px;"><Star /></el-icon>
              寶石
            </el-option>
            <el-option value="Star" label="星星">
              <el-icon style="margin-right: 8px;"><Star /></el-icon>
              星星
            </el-option>
            <el-option value="Star" label="愛心">
              <el-icon style="margin-right: 8px;"><Star /></el-icon>
              愛心
            </el-option>
            <el-option value="Star" label="皇冠">
              <el-icon style="margin-right: 8px;"><Star /></el-icon>
              皇冠
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="categoryForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="請輸入分類描述"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number 
            v-model="categoryForm.sort" 
            :min="0" 
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-switch 
            v-model="categoryForm.status" 
            :active-value="1" 
            :inactive-value="0"
            active-text="啟用" 
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Star } from '@element-plus/icons-vue'

// 響應式數據
const loading = ref(false)
const searchQuery = ref('')
const showCategoryDialog = ref(false)
const showAddDialog = ref(false)
const isEdit = ref(false)
const currentCategory = ref(null)
const treeRef = ref()
const formRef = ref()

// 樹狀結構屬性
const treeProps = {
  children: 'children',
  label: 'name'
}

// 表單數據
const categoryForm = ref({
  name: '',
  code: '',
  parentId: null,
  icon: 'Star',
  description: '',
  sort: 0,
  status: 1
})

// 表單驗證規則
const formRules = {
  name: [
    { required: true, message: '請輸入分類名稱', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '請輸入分類代碼', trigger: 'blur' }
  ]
}

// 模擬分類數據
const categories = ref([
  {
    id: 1,
    name: '項鍊',
    code: 'necklace',
    parentId: null,
    icon: 'Heart',
    description: '各種款式的項鍊飾品',
    sort: 1,
    status: 1,
    productCount: 25,
    children: [
      {
        id: 11,
        name: '短項鍊',
        code: 'short-necklace',
        parentId: 1,
        icon: 'Heart',
        description: '16-18英寸的短項鍊',
        sort: 1,
        status: 1,
        productCount: 12
      },
      {
        id: 12,
        name: '長項鍊',
        code: 'long-necklace',
        parentId: 1,
        icon: 'Heart',
        description: '20英寸以上的長項鍊',
        sort: 2,
        status: 1,
        productCount: 13
      }
    ]
  },
  {
    id: 2,
    name: '手鍊',
    code: 'bracelet',
    parentId: null,
    icon: 'Star',
    description: '各種手鍊飾品',
    sort: 2,
    status: 1,
    productCount: 18,
    children: []
  },
  {
    id: 3,
    name: '戒指',
    code: 'ring',
    parentId: null,
    icon: 'Star',
    description: '各種戒指飾品',
    sort: 3,
    status: 1,
    productCount: 15,
    children: []
  }
])

// 計算屬性
const categoriesTree = computed(() => categories.value)

const flatCategories = computed(() => {
  const flatten = (items) => {
    let result = []
    items.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        result.push(...flatten(item.children))
      }
    })
    return result
  }
  return flatten(categories.value)
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value
  }
  
  const filterTree = (items) => {
    return items.filter(item => {
      const matchCurrent = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchChildren = item.children && item.children.length > 0 ? 
        filterTree(item.children).length > 0 : false
      
      if (matchCurrent || matchChildren) {
        if (item.children && item.children.length > 0) {
          item.children = filterTree(item.children)
        }
        return true
      }
      return false
    })
  }
  
  return filterTree(JSON.parse(JSON.stringify(categories.value)))
})

const dialogTitle = computed(() => {
  if (isEdit.value) {
    return '編輯分類'
  } else if (currentCategory.value) {
    return `新增子分類 - ${currentCategory.value.name}`
  } else {
    return '新增分類'
  }
})

// 方法
const expandAll = () => {
  const keys = flatCategories.value.map(item => item.id)
  treeRef.value.setExpandedKeys(keys)
}

const editCategory = (category) => {
  isEdit.value = true
  currentCategory.value = category
  categoryForm.value = { ...category }
  showCategoryDialog.value = true
}

const addSubCategory = (parentCategory) => {
  isEdit.value = false
  currentCategory.value = parentCategory
  categoryForm.value = {
    name: '',
    code: '',
    parentId: parentCategory.id,
    icon: 'Star',
    description: '',
    sort: 0,
    status: 1
  }
  showCategoryDialog.value = true
}

const deleteCategory = async (category) => {
  if (category.productCount > 0) {
    ElMessage.warning('該分類下還有商品，無法刪除')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `確定要刪除分類「${category.name}」嗎？`,
      '確認刪除',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 刪除邏輯
    const deleteFromTree = (items, id) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items.splice(i, 1)
          return true
        }
        if (items[i].children && items[i].children.length > 0) {
          if (deleteFromTree(items[i].children, id)) {
            return true
          }
        }
      }
      return false
    }
    
    deleteFromTree(categories.value, category.id)
    ElMessage.success('分類刪除成功')
  } catch {
    // 用戶取消操作
  }
}

const toggleStatus = (category) => {
  const status = category.status === 1 ? '啟用' : '停用'
  ElMessage.success(`分類已${status}`)
}

const handleDrop = (dragNode, dropNode, dropType) => {
  ElMessage.success('分類順序已更新')
}

const saveCategory = async () => {
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      // 編輯邏輯
      Object.assign(currentCategory.value, categoryForm.value)
      ElMessage.success('分類更新成功')
    } else {
      // 新增邏輯
      const newCategory = {
        ...categoryForm.value,
        id: Date.now(), // 臨時ID
        productCount: 0,
        children: []
      }
      
      if (categoryForm.value.parentId) {
        // 新增為子分類
        const findAndAddChild = (items, parentId) => {
          for (let item of items) {
            if (item.id === parentId) {
              if (!item.children) item.children = []
              item.children.push(newCategory)
              return true
            }
            if (item.children && item.children.length > 0) {
              if (findAndAddChild(item.children, parentId)) {
                return true
              }
            }
          }
          return false
        }
        findAndAddChild(categories.value, categoryForm.value.parentId)
      } else {
        // 新增為頂級分類
        categories.value.push(newCategory)
      }
      
      ElMessage.success('分類新增成功')
    }
    
    showCategoryDialog.value = false
  } catch (error) {
    console.error('表單驗證失敗:', error)
  }
}

const resetForm = () => {
  categoryForm.value = {
    name: '',
    code: '',
    parentId: null,
    icon: 'Star',
    description: '',
    sort: 0,
    status: 1
  }
  isEdit.value = false
  currentCategory.value = null
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 監聽新增對話框
const handleAdd = () => {
  isEdit.value = false
  currentCategory.value = null
  resetForm()
  showCategoryDialog.value = true
}

// 監聽showAddDialog變化
const unwatchAdd = ref()
onMounted(() => {
  unwatchAdd.value = showAddDialog.value
  if (unwatchAdd.value) {
    handleAdd()
  }
})
</script>

<style scoped>
.categories-view {
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

.categories-tree {
  margin-bottom: 20px;
}

.categories-table {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  color: var(--el-color-primary);
}

.node-actions {
  display: none;
}

.tree-node:hover .node-actions {
  display: block;
}
</style>