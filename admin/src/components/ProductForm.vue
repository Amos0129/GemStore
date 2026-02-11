<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item label="商品名稱" prop="name">
      <el-input v-model="form.name" placeholder="請輸入商品名稱" />
    </el-form-item>
    
    <el-form-item label="商品分類" prop="category">
      <el-select v-model="form.category" placeholder="請選擇分類">
        <el-option label="項鍊" value="necklace" />
        <el-option label="手鍊" value="bracelet" />
        <el-option label="戒指" value="ring" />
        <el-option label="耳環" value="earring" />
      </el-select>
    </el-form-item>
    
    <el-form-item label="商品價格" prop="price">
      <el-input-number v-model="form.price" :min="0" controls-position="right" />
    </el-form-item>
    
    <el-form-item label="商品庫存" prop="stock">
      <el-input-number v-model="form.stock" :min="0" controls-position="right" />
    </el-form-item>
    
    <el-form-item label="商品圖片" prop="image">
      <el-input v-model="form.image" placeholder="請輸入圖片URL" />
    </el-form-item>
    
    <el-form-item label="商品描述" prop="description">
      <el-input v-model="form.description" type="textarea" :rows="4" />
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
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const formRef = ref()
const form = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  image: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇商品分類', trigger: 'change' }],
  price: [{ required: true, message: '請輸入商品價格', trigger: 'blur' }]
}

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct }
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