<template>
  <div class="chart-container" :style="{ height: height + 'px' }">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  height: {
    type: Number,
    default: 300
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(30, 30, 46, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#00d4ff',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 212, 255, 0.1)'
          },
          ticks: {
            color: '#b0b0b0',
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 212, 255, 0.1)'
          },
          ticks: {
            color: '#b0b0b0'
          }
        }
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
          backgroundColor: '#00d4ff',
          borderColor: '#ffffff',
          borderWidth: 2
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

watch(
  () => props.data,
  () => {
    if (chartInstance) {
      chartInstance.data = props.data
      chartInstance.update()
    }
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>