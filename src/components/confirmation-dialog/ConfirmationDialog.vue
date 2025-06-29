<script setup lang="ts">
import BaseDialog from '@/components/base-dialog'
const visible = defineModel({ type: Boolean, default: false })
interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}
withDefaults(defineProps<Props>(), {
  title: 'Tip',
  message: "Are you sure you're ready to do this?",
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{ cancel: []; confirm: [] }>()

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleConfirm = () => {
  visible.value = false
  emit('confirm')
}
</script>
<template>
  <BaseDialog v-model="visible" :title="title" class="dialog" @close="handleCancel">
    <div class="dialog__body">
      <slot>
        <div class="dialog__body-msg">{{ message }}</div>
      </slot>
    </div>
    <template #footer>
      <div class="dialog__footer">
        <button class="dialog__footer-confirm" @click="handleConfirm">{{ confirmText }}</button>
        <button class="dialog__footer-cancel" @click="handleCancel">{{ cancelText }}</button>
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
    flex-direction: column;

    button {
      cursor: pointer;
      width: 100%;
    }
    &-confirm {
      padding: var(--spacing-16);
      border-radius: var(--spacing-8);
      background-color: var(--color-red);
      border: 1px solid var(--color-grey-200);
      @include text.text-styles('text-preset-4-bold');
      color: var(--color-white);
      &:hover {
        background:
          linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), var(--color-red);
      }
    }
    &-cancel {
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-500);
      border: none;
      background-color: var(--color-white);
      &:hover {
        color: var(--color-grey-900);
      }
    }
  }
}
</style>
