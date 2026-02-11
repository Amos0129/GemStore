<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1500
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const currentValue = ref(0)
const formattedValue = ref('')

const animate = (start, end, duration) => {
  const range = end - start
  const increment = range / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      current = end
      clearInterval(timer)
    }
    
    currentValue.value = current
    formattedValue.value = `${props.prefix}${Math.floor(current).toLocaleString()}${props.suffix}`
  }, 16)
}

watch(
  () => props.value,
  (newVal) => {
    animate(currentValue.value, newVal, props.duration)
  }
)

onMounted(() => {
  animate(0, props.value, props.duration)
})
</script>