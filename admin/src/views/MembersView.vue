<template>
  <div class="members-view">
    <div class="view-header">
      <h1>會員管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><UserFilled /></el-icon>
        新增會員
      </el-button>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="search-filters">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜尋會員姓名或信箱"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="會員狀態" clearable>
            <el-option label="全部狀態" value="" />
            <el-option label="正常" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="levelFilter" placeholder="會員等級" clearable>
            <el-option label="全部等級" value="" />
            <el-option label="一般會員" value="bronze" />
            <el-option label="銀級會員" value="silver" />
            <el-option label="金級會員" value="gold" />
            <el-option label="白金會員" value="platinum" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="註冊開始日期"
            end-placeholder="註冊結束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
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
              <div class="stat-label">總會員數</div>
            </div>
            <el-icon class="stat-icon"><User /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ stats.active }}</div>
              <div class="stat-label">活躍會員</div>
            </div>
            <el-icon class="stat-icon"><UserFilled /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ stats.newThisMonth }}</div>
              <div class="stat-label">本月新增</div>
            </div>
            <el-icon class="stat-icon"><Plus /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">${{ stats.avgSpending }}</div>
              <div class="stat-label">平均消費</div>
            </div>
            <el-icon class="stat-icon"><Money /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 會員列表 -->
    <div class="members-table">
      <el-table 
        :data="filteredMembers" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="頭像" width="80">
          <template #default="scope">
            <el-avatar 
              :src="scope.row.avatar" 
              :alt="scope.row.name"
              size="medium"
            >
              {{ scope.row.name.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="信箱" min-width="200" />
        <el-table-column prop="phone" label="電話" width="130" />
        <el-table-column prop="level" label="會員等級" width="120">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ getLevelText(scope.row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalSpent" label="累計消費" width="120">
          <template #default="scope">
            ${{ scope.row.totalSpent.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="訂單數" width="100" />
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="註冊時間" width="160">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="viewMember(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              @click="editMember(scope.row)"
            >
              編輯
            </el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '停用' : '啟用' }}
            </el-button>
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

    <!-- 新增會員對話框 -->
    <el-dialog v-model="showAddDialog" title="新增會員" width="600px">
      <MemberForm 
        @save="handleSave"
        @cancel="showAddDialog = false"
      />
    </el-dialog>

    <!-- 編輯會員對話框 -->
    <el-dialog v-model="showEditDialog" title="編輯會員" width="600px">
      <MemberForm 
        :member="currentMember"
        @save="handleUpdate"
        @cancel="showEditDialog = false"
      />
    </el-dialog>

    <!-- 會員詳情對話框 -->
    <el-dialog v-model="showDetailDialog" title="會員詳情" width="800px">
      <MemberDetail :member="currentMember" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, Search, User, Plus, Money } from '@element-plus/icons-vue'
import MemberForm from '@/components/MemberForm.vue'
import MemberDetail from '@/components/MemberDetail.vue'

// 響應式數據
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const currentMember = ref(null)

// 統計數據
const stats = ref({
  total: 1286,
  active: 1156,
  newThisMonth: 47,
  avgSpending: 2156
})

// 模擬會員數據
const members = ref([
  {
    id: 1,
    name: '陳美玲',
    email: 'chen@example.com',
    phone: '0912-345-678',
    avatar: null,
    level: 'gold',
    totalSpent: 15800,
    orderCount: 8,
    status: 'active',
    createdAt: '2023-08-15T10:30:00Z'
  },
  {
    id: 2,
    name: '李志明',
    email: 'lee@example.com',
    phone: '0987-654-321',
    avatar: null,
    level: 'silver',
    totalSpent: 8500,
    orderCount: 5,
    status: 'active',
    createdAt: '2023-10-22T14:15:00Z'
  },
  {
    id: 3,
    name: '王小華',
    email: 'wang@example.com',
    phone: '0955-123-456',
    avatar: null,
    level: 'bronze',
    totalSpent: 2800,
    orderCount: 2,
    status: 'inactive',
    createdAt: '2024-01-08T16:45:00Z'
  }
])

// 計算屬性
const filteredMembers = computed(() => {
  let filtered = members.value

  if (searchQuery.value) {
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(member => member.status === statusFilter.value)
  }

  if (levelFilter.value) {
    filtered = filtered.filter(member => member.level === levelFilter.value)
  }

  return filtered
})

// 方法
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const viewMember = (member) => {
  currentMember.value = member
  showDetailDialog.value = true
}

const editMember = (member) => {
  currentMember.value = { ...member }
  showEditDialog.value = true
}

const toggleStatus = async (member) => {
  try {
    const newStatus = member.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? '啟用' : '停用'
    
    await ElMessageBox.confirm(
      `確定要${action}會員「${member.name}」嗎？`,
      '確認操作',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    member.status = newStatus
    ElMessage.success(`會員已${action}`)
  } catch {
    // 用戶取消操作
  }
}

const handleSave = (memberData) => {
  // 新增會員邏輯
  const newMember = {
    ...memberData,
    id: members.value.length + 1,
    totalSpent: 0,
    orderCount: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  }
  
  members.value.push(newMember)
  showAddDialog.value = false
  ElMessage.success('會員新增成功')
  stats.value.total++
  stats.value.active++
}

const handleUpdate = (memberData) => {
  // 更新會員邏輯
  const index = members.value.findIndex(m => m.id === currentMember.value.id)
  if (index > -1) {
    members.value[index] = { ...memberData, id: currentMember.value.id }
    showEditDialog.value = false
    ElMessage.success('會員資料更新成功')
  }
}

onMounted(() => {
  // 載入會員數據
  total.value = members.value.length
})
</script>

<style scoped>
.members-view {
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

.members-table {
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