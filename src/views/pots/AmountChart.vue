<script setup lang="ts">
import type { Pot } from '@/types/pot'
import { formatNumber } from '@/utils/numberUtils'
import { computed } from 'vue'

interface Props {
  type?: 'static' | 'dynamic'
  mode?: 'add' | 'withdraw'
  data: Pot
  dynamicAmount?: number
}
const props = withDefaults(defineProps<Props>(), { type: 'dynamic', mode: 'add', dynamicAmount: 0 })
const amountLable = props.type === 'dynamic' ? 'New Amount' : 'Total Saved'
// 格式化金额
const formatAmount = (amount: number) => {
  return formatNumber(amount, { currency: 'USD' })
}
const potsWithProgress = computed(() => {
  if (props.type === 'dynamic') {
    if (props.mode === 'add') {
      const progressPercentage = Math.min(((props.data.total ?? 0) / props.data.target) * 100, 100)
      const dynamicProgressPercentage = Math.min(
        (props.dynamicAmount / props.data.target) * 100,
        100,
      )
      return {
        ...props.data,
        progressPercentage,
        dynamicProgressPercentage,
        totalPercentage: Math.min(progressPercentage + dynamicProgressPercentage, 100),
        totalAmount: (props.data.total ?? 0) + props.dynamicAmount,
      }
    } else {
      const progressPercentage = Math.max(
        (((props.data.total ?? 0) - props.dynamicAmount) / props.data.target) * 100,
        0,
      )
      const dynamicProgressPercentage = Math.min(
        (props.dynamicAmount / props.data.target) * 100,
        100,
      )
      return {
        ...props.data,
        progressPercentage,
        dynamicProgressPercentage,
        totalPercentage: progressPercentage,
        totalAmount: (props.data.total ?? 0) - props.dynamicAmount,
      }
    }
  } else {
    const progressPercentage = Math.min(((props.data.total ?? 0) / props.data.target) * 100, 100)
    return {
      ...props.data,
      progressPercentage,
      dynamicProgressPercentage: 0,
      totalPercentage: progressPercentage,
      totalAmount: props.data.total ?? 0,
    }
  }
})

const progressFillStyle = computed(() => {
  const width = { width: `${potsWithProgress.value.progressPercentage}%` }
  if (props.type === 'dynamic') {
    return width
  } else {
    return {
      ...width,
      backgroundColor: props.data.theme,
    }
  }
})

const progressDynamicStyle = computed(() => ({
  width: `${potsWithProgress.value.dynamicProgressPercentage}%`,
  backgroundColor: props.mode === 'add' ? 'var(--color-green)' : 'var(--color-red)',
}))

const progressPercentageStyle = computed(() => {
  if (props.type === 'dynamic') {
    return {
      color: props.mode === 'add' ? 'var(--color-green)' : 'var(--color-red)',
    }
  } else {
    return {
      color: 'var(--color-grey-500)',
    }
  }
})
</script>
<template>
  <div class="total">
    <div class="total__saved">
      <div class="total__saved-label">{{ amountLable }}</div>
      <div class="total__saved-value">
        {{ formatAmount(potsWithProgress.totalAmount) }}
      </div>
    </div>
    <div class="progress">
      <div class="progress__fill" :style="progressFillStyle"></div>
      <div class="progress__dynamic" :style="progressDynamicStyle"></div>
    </div>
    <div class="target">
      <div class="target__percentage" :style="progressPercentageStyle">
        {{ formatNumber(potsWithProgress.totalPercentage, { style: 'decimal' }) }}%
      </div>
      <div class="target__total">Target of {{ formatAmount(potsWithProgress.target) }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.total {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);

  &__saved {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-label {
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-500);
    }
    &-value {
      @include text.text-styles('text-preset-1');
      color: var(--color-grey-900);
    }
  }

  .progress {
    height: 8px;
    border-radius: var(--spacing-4);
    background-color: var(--color-beige-100);
    display: flex;
    gap: 2px;

    &__fill {
      height: 100%;
      border-top-left-radius: var(--spacing-4);
      border-bottom-left-radius: var(--spacing-4);
      background-color: var(--color-grey-900);
    }

    &__dynamic {
      height: 100%;
      border-top-right-radius: var(--spacing-4);
      border-bottom-right-radius: var(--spacing-4);
    }
  }

  .target {
    display: flex;
    justify-content: space-between;
    color: var(--color-grey-500);

    &__percentage {
      @include text.text-styles('text-preset-5-bold');
    }

    &__total {
      @include text.text-styles('text-preset-5');
    }
  }
}
</style>
