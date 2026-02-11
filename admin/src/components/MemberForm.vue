<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="請輸入會員姓名" />
    </el-form-item>
    
    <el-form-item label="信箱" prop="email">
      <el-input v-model="form.email" placeholder="請輸入信箱" />
    </el-form-item>
    
    <el-form-item label="電話" prop="phone">
      <el-input v-model="form.phone" placeholder="請輸入電話" />
    </el-form-item>
    
    <el-form-item label="會員等級" prop="level">
      <el-select v-model="form.level" placeholder="請選擇會員等級">
        <el-option label="一般會員" value="bronze" />
        <el-option label="銀級會員" value="silver" />
        <el-option label="金級會員" value="gold" />
        <el-option label="白金會員" value="platinum" />
      </el-select>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const formRef = ref()
const form = ref({
  name: '',
  email: '',
  phone: '',
  level: 'bronze'
})

const rules = {
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    { type: 'email', message: '請輸入正確的信箱格式', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '請輸入電話', trigger: 'blur' }]
}

watch(() => props.member, (newMember) => {
  if (newMember) {
    form.value = { ...newMember }
  }
}, { immediate: true })

const handleSave = async () => {
  try {
    await formRef.value.validate()
    emit('save', form.value)
  } catch (error) {
    console.error('表單驗證失敗:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>