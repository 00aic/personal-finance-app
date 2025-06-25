<script setup lang="ts">
const visible = defineModel({ type: Boolean, default: false })
interface Props {
  title?: string
  tip?: string
  showClose?: boolean
}
withDefaults(defineProps<Props>(), {
  title: 'Tip',
  showClose: true,
})

const emit = defineEmits<{ close: [] }>()

const handleClose = () => {
  visible.value = false
  emit('close')
}
</script>
<template>
  <Transition name="fade">
    <div class="dialog-mask" v-if="visible">
      <Transition name="slide-up">
        <div class="dialog-container" v-if="visible">
          <div class="dialog__header">
            <div class="dialog__header-title">{{ title }}</div>
            <div v-if="showClose" @click="handleClose">
              <img src="@/assets/images/icon-close-modal.svg" alt="close" />
            </div>
          </div>
          <div class="dialog__tip" v-if="tip">
            {{ tip }}
          </div>
          <div class="dialog__body">
            <slot></slot>
          </div>
          <div class="dialog__footer">
            <slot name="footer"></slot>
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-container {
    gap: var(--spacing-20);
    padding: var(--spacing-24) var(--spacing-20);
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

  &__tip,
  &__body-msg {
    @include text.text-styles('text-preset-4');
    color: var(--color-grey-500);
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
