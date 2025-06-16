<script setup lang="ts">
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
  <Transition name="fade">
    <div class="dialog-mask" v-if="visible">
      <Transition name="slide-up">
        <div class="dialog-container" v-if="visible">
          <div class="dialog__header">
            <div class="dialog__header-title">{{ title }}</div>
            <div @click="handleCancel">
              <img src="@/assets/images/icon-close-modal.svg" alt="close" />
            </div>
          </div>
          <div class="dialog__body">
            <slot>
              <div class="dialog__body-msg">{{ message }}</div>
            </slot>
          </div>
          <div class="dialog__footer">
            <button class="dialog__footer-confirm" @click="handleConfirm">{{ confirmText }}</button>
            <button class="dialog__footer-cancel" @click="handleCancel">{{ cancelText }}</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.dialog {
  &-mask {
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-container {
    gap: var(--spacing-20);
    padding: var(--spacing-32);
    border-radius: var(--spacing-12);
    background-color: var(--color-white);
    box-shadow: 0 8px 24px 0 var(--color-shadow-1);
    display: flex;
    flex-direction: column;
    width: 335px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    &-title {
      @include text.text-styles('text-preset-2');
      color: var(--color-grey-900);
    }
  }

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
    }
    &-cancel {
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-500);
      border: none;
      background-color: var(--color-white);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
