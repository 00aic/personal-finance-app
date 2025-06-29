<script setup lang="ts">
import BaseDialog from '@/components/base-dialog'
import type { Budget } from '@/types/budget'
import { computed, ref, watch } from 'vue'
import FormItem from '@/components/form-item'
import SelectPicker from '@/components/select-picker'
import { CATEGORY_OPTIONS } from '@/constants/categories'
import { COLOR_OPTIONS } from '@/constants/colors'
import BaseInput from '@/components/base-input'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const visible = defineModel<boolean>({ default: false })
interface Props {
  data?: Budget
  usedTheme: string[]
}
const props = defineProps<Props>()
const title = computed(() => {
  return props?.data?.category ? 'Edit Budget' : 'Add New Budget'
})

const tip = computed(() =>
  props?.data?.category
    ? 'As your budgets change, feel free to update your spending limits.'
    : 'Choose a category to set a spending budget. These categories can help you monitor spending.',
)

const buttonName = computed(() => (props?.data?.category ? 'Save Changes' : 'Add Budget'))

const formData = ref<Budget>({
  category: 'Entertainment',
  theme: '#277C78',
  maximum: 0,
})

watch(
  () => props.data,
  (newData: Budget | undefined) => {
    if (newData) {
      formData.value = { ...newData }
    }
  },
  { immediate: true },
)

const schema = yup.object({
  maximum: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value
    })
    .typeError('Must be number') // 非数字时报错
    .required("Can't be empty"), // 空时才报 required
})
const { handleSubmit } = useForm<Budget>({
  validationSchema: schema,
})

const emit = defineEmits<{ upsert: [data: Budget] }>()

const handleUpsert = handleSubmit(() => {
  formData.value.maximum = Number(formData.value.maximum)
  emit('upsert', formData.value)
  visible.value = false
})
</script>
<template>
  <BaseDialog v-model="visible" :title="title" :tip="tip">
    <form class="form">
      <FormItem
        v-model="formData.category"
        name="category"
        label="Budget Category"
        v-slot="{ field }"
      >
        <SelectPicker
          v-bind="field"
          :model-value="field.value"
          :options="CATEGORY_OPTIONS"
          class="form__select"
          width="100%"
        />
      </FormItem>
      <FormItem v-model="formData.maximum" name="maximum" label="Maximum Spend" v-slot="{ field }">
        <BaseInput v-bind="field" :model-value="field.value" prefix="$" placeholder="e.g.2000" />
      </FormItem>

      <FormItem v-model="formData.theme" name="theme" label="Theme" v-slot="{ field }">
        <SelectPicker
          v-bind="field"
          :model-value="field.value"
          :options="COLOR_OPTIONS"
          class="form__select"
          width="100%"
          type="color"
          :used-values="usedTheme"
        />
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
  cursor: pointer;
}
</style>
