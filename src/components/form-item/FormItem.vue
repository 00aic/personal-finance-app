<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import { computed } from 'vue'
const modelValue = defineModel()
interface Props {
  label?: string
  name: string
  placeholder?: string
}
defineProps<Props>()

const showError = computed(() => {
  return (meta: { touched: boolean }, errors: string[]) => {
    const result = meta.touched && errors[0]
    return !!(result || result === '')
  }
})
</script>
<template>
  <div class="form-group">
    <Field v-model="modelValue" :name="name" v-slot="{ field, meta, errors }">
      <div class="form-title">
        <label :for="name" :class="['form-label', { 'error-label': showError(meta, errors) }]">{{
          label
        }}</label>
        <ErrorMessage :name="name" class="error-message" />
      </div>
      <!-- 包裹插槽内容的容器 -->
      <div :class="['input-wrapper', { 'error-border': showError(meta, errors) }]">
        <slot
          v-bind="{
            field,
            meta,
            errors,
          }"
        >
          <input v-bind="field" type="text" :id="name" :placeholder="placeholder" />
        </slot>
      </div>
    </Field>
  </div>
</template>
<style lang="scss" scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  // flex: 1;
}

.form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.form-label {
  @include text.text-styles('text-preset-5-bold');
  color: var(--color-grey-500);
  text-align: center;
}

// .form-input {
// }

.input-wrapper {
  width: 100%;
  // margin-bottom: 16px;

  :deep(input),
  :deep(select),
  :deep(textarea),
  :deep(.vee-form) {
    width: 100%;
    padding: var(--spacing-12) var(--spacing-20);
    border-radius: var(--spacing-8);
    background-color: var(--color-white);
    border: 1px solid var(--color-beige-500);
    @include text.text-styles('text-preset-4');
    color: var(--color-grey-900);
    cursor: pointer;

    &:focus {
      border-color: var(--color-grey-500);
      outline: none; /* 去除默认的聚焦外框 */
    }
  }

  :deep(input::placeholder),
  :deep(select::placeholder),
  :deep(textarea::placeholder) {
    @include text.text-styles('text-preset-4');
    color: var(--color-beige-500);
  }

  &.error-border {
    :deep(input),
    :deep(select),
    :deep(textarea),
    :deep(.vee-form) {
      border-color: var(--color-red);
    }
  }
}

.error-label {
  color: var(--color-red);
}

.error-message {
  color: var(--color-red);
  font-weight: 600;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: -0.21px;
}
</style>
