<script setup lang="ts">
interface Props {
  type?: string
  prefix?: string
  placeholder?: string
}
withDefaults(defineProps<Props>(), {
  type: 'text',
})
const value = defineModel<never>()
</script>
<template>
  <div class="base-input">
    <span class="base-input__prefix">{{ prefix }}</span>
    <input class="base-input__input" :type="type" v-model="value" :placeholder="placeholder" />
  </div>
</template>
<style lang="scss" scoped>
.base-input {
  position: relative;
  &__prefix {
    @include text.text-styles('text-preset-4');
    color: var(--color-beige-500);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: var(--spacing-20);
  }
  &__input {
    padding-left: 42px !important;
  }
}
</style>
