<script setup lang="ts">
import { ref, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

// 注册Chart.js组件
ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetData {
  entertainment: number
  bills: number
  dining: number
  personal: number
}

const budgetData = ref<BudgetData>({
  entertainment: 50.0,
  bills: 750.0,
  dining: 75.0,
  personal: 100.0,
})

const totalSpent = computed(() => {
  return Object.values(budgetData.value).reduce((sum, amount) => sum + amount, 0)
})

const totalLimit = ref<number>(975)

defineProps<{ data: ChartData<'doughnut'> }>()

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed
          const percentage = ((value / totalSpent.value) * 100).toFixed(1)
          return `${label}: ${value.toFixed(2)} (${percentage}%)`
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: false,
    duration: 800,
    easing: 'easeInOutQuart',
  },
  elements: {
    arc: {
      hoverBorderWidth: 2,
      hoverBorderColor: '#fff',
    },
  },
  interaction: {
    intersect: false,
  },
}))

// 可以添加一些交互方法
const updateBudget = (category: keyof BudgetData, amount: number) => {
  budgetData.value[category] = amount
}

// 暴露给父组件使用
defineExpose({
  updateBudget,
  budgetData,
  totalSpent,
})
</script>

<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <Doughnut :data="data" :options="chartOptions" :width="200" :height="200" />
      <div class="chart-center">
        <div class="amount">${{ totalSpent }}</div>
        <div class="limit">of ${{ totalLimit }} limit</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.chart-wrapper {
  position: relative;
  display: inline-block;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.amount {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.limit {
  font-size: 14px;
  color: #666;
}
</style>
