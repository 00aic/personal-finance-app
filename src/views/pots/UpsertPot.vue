<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog'
import type { Pot } from '@/types/pot'
import { computed, ref, watch } from 'vue'
import { COLOR_OPTIONS } from '@/constants/colors'
import SelectPicker from '@/components/SelectPicker'
import FormItem from '@/components/FormItem'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import BaseInput from '@/components/BaseInput'

const visible = defineModel<boolean>({ default: false })

interface Props {
  data?: Pot
}
const props = defineProps<Props>()

const title = computed(() => (props.data?.name ? 'Edit Pot' : 'Add New Pot'))
const tip = computed(() =>
  props?.data?.name
    ? 'If your saving targets change, feel free to update your pots.'
    : 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.',
)

const buttonName = computed(() => (props?.data?.name ? 'Save Changes' : 'Add Pot'))

const formData = ref<Pot>({
  id: '',
  name: '',
  target: 0,
  theme: '#277C78',
})

watch(
  () => props.data,
  (newData: Pot | undefined) => {
    if (newData) {
      formData.value = { ...newData }
    }
  },
  { immediate: true },
)

const schema = yup.object({
  name: yup.string().max(30).required("Can't be empty"), // 空时才报 required
  target: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value
    })
    .typeError('Must be number') // 非数字时报错
    .required("Can't be empty"), // 空时才报 required
})
const { handleSubmit } = useForm<Pot>({
  validationSchema: schema,
})

const emit = defineEmits<{ upset: [data: Pot] }>()
const handleUpsert = handleSubmit(() => {
  emit('upset', formData.value)
  visible.value = false
})
</script>
<template>
  <BaseDialog v-model="visible" :title="title" :tip="tip">
    <form class="form">
      <FormItem v-model="formData.name" name="name" label="Pot Name" placeholder="e.g. Rainy Days">
      </FormItem>
      <FormItem v-model="formData.target" name="target" label="Target" v-slot="{ field }">
        <BaseInput v-bind="field" :model-value="field.value" prefix="$" placeholder="e.g.2000" />
      </FormItem>
      <FormItem v-model="formData.theme" name="theme" label="Theme" v-slot="{ field }">
        <SelectPicker
          v-bind="field"
          :model-value="field.value"
          :options="COLOR_OPTIONS"
          class="form__select"
          width="100%"
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
}
</style>
