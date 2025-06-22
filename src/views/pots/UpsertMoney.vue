<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog'
import type { Pot } from '@/types/pot'
import { computed, ref, watch } from 'vue'
import FormItem from '@/components/FormItem'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import BaseInput from '@/components/BaseInput'
import AmountChart from './AmountChart.vue'

const visible = defineModel<boolean>({ default: false })

interface Props {
  mode?: 'add' | 'withdraw'
  data: Pot
}
const props = withDefaults(defineProps<Props>(), { mode: 'add' })

const title = computed(() => {
  return props.mode === 'add' ? `Add to '${props.data.name}'` : `Withdraw from '${props.data.name}'`
})
const tip = computed(() => {
  return props.mode === 'add'
    ? 'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.'
    : 'Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.'
})
const dynamicAmountLabel = computed(() =>
  props.mode === 'add' ? 'Amount to Add' : 'Amount to Withdraw',
)
const buttonName = computed(() => {
  return props.mode === 'add' ? 'Confirm Addition' : 'Confirm Withdrawal'
})

const formData = ref<{
  dynamicAmount: number
}>({
  dynamicAmount: 0,
})

const schema = computed(() => {
  const max =
    props.mode === 'add'
      ? Number(props.data.target - (props.data.total ?? 0))
      : Number(props.data.total ?? 0)
  const maxMsg =
    props.mode === 'add'
      ? `Must be less than ${max}(${props.data.target} - ${props.data.total ?? 0} )`
      : `Must be less than ${max}`
  return yup.object({
    dynamicAmount: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value
      })
      .typeError('Must be number') // 非数字时报错
      .max(max, maxMsg)
      .min(0, 'Must be more than 0')
      .required("Can't be empty"), // 空时才报 required
  })
})
const { handleSubmit } = useForm<Pot>({
  validationSchema: schema,
})

const emit = defineEmits<{ upset: [data: number] }>()
const handleUpsert = handleSubmit(() => {
  const total =
    props.mode === 'add'
      ? Number(props.data.total ?? 0) + Number(formData.value.dynamicAmount)
      : Number(props.data.total ?? 0) - Number(formData.value.dynamicAmount)
  emit('upset', Number(total))
  visible.value = false
})

watch(
  () => props.mode,
  () => {
    formData.value.dynamicAmount = 0
  },
)
</script>
<template>
  <BaseDialog v-model="visible" :title="title" :tip="tip">
    <form class="form">
      <AmountChart :mode="mode" :data="data" :dynamic-amount="Number(formData.dynamicAmount)" />
      <FormItem
        v-model="formData.dynamicAmount"
        name="dynamicAmount"
        :label="dynamicAmountLabel"
        v-slot="{ field }"
      >
        <BaseInput v-bind="field" :model-value="field.value" prefix="$" placeholder="e.g.2000" />
      </FormItem>
    </form>

    <template #footer>
      <button class="button" @click="handleUpsert">{{ buttonName }}</button>
    </template>
  </BaseDialog>
</template>
<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);

  &__select {
    flex: 1;
    width: 100%;
  }
}

.button {
  padding: var(--spacing-16);
  border-radius: 8px;
  background-color: var(--color-grey-900);
  border: 1px solid var(--color-grey-200);
  width: 100%;
  @include text.text-styles('text-preset-4-bold');
  color: var(--color-white);
}
</style>
