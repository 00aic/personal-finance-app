<script setup lang="ts">
import BaseDialog from '@/components/base-dialog'
const visible = defineModel({ type: Boolean, default: false })
interface Props {
  title?: string
  message?: string
  confirmText?: string
}
withDefaults(defineProps<Props>(), {
  title: 'Tip',
  message: 'The operation was successful.',
  confirmText: 'Confirm',
})

const emit = defineEmits<{ confirm: [] }>()

const handleConfirm = () => {
  visible.value = false
  emit('confirm')
}
</script>
<template>
  <BaseDialog v-model="visible" :title="title" :show-close="false" class="dialog">
    <div class="dialog__body">
      <slot>
        <div class="dialog__body-msg">{{ message }}</div>
      </slot>
    </div>
    <template #footer>
      <div class="dialog__footer">
        <button class="dialog__footer-confirm" @click="handleConfirm">{{ confirmText }}</button>
      </div>
    </template>
  </BaseDialog>
</template>
<style lang="scss" scoped>
.dialog {
  &__body {
    &-msg {
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-500);
    }
  }

  &__footer {
    display: flex;
    gap: var(--spacing-20);
    justify-content: end;

    &-confirm {
      cursor: pointer;
      padding: var(--spacing-8);
      border-radius: var(--spacing-8);
      background-color: var(--color-grey-900);
      border: 1px solid var(--color-grey-200);
      @include text.text-styles('text-preset-5');
      color: var(--color-white);
    }
  }
}
</style>
