<script setup lang="ts">
import { computed } from 'vue'
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

interface Props {
  data: ChartData<'doughnut'>
  limit: number
  spent: number
}

const props = defineProps<Props>()

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
          const percentage = ((value / props.spent) * 100).toFixed(1)
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

// // 可以添加一些交互方法
// const updateBudget = (category: keyof BudgetData, amount: number) => {
//   budgetData.value[category] = amount
// }

// // 暴露给父组件使用
// defineExpose({
//   updateBudget,
//   budgetData,
// })
</script>

<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <Doughnut :data="data" :options="chartOptions" :width="240" :height="240" />
      <div class="chart-center">
        <div class="amount">${{ spent }}</div>
        <div class="limit">of ${{ limit }} limit</div>
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
