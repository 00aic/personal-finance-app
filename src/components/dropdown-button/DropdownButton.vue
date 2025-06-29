<script setup lang="ts">
import { useClickOutside } from '@/composables/useClickOutside'
import { ref, useTemplateRef } from 'vue'

const visible = ref<boolean>(false)
interface Option {
  label: string
  value: string
}
interface Props {
  options: Option[]
}
defineProps<Props>()

const handleDropdown = () => {
  visible.value = !visible.value
}
const emit = defineEmits<{ select: [selected: string] }>()
const handleSelect = (selected: string) => {
  emit('select', selected)
}
const closeDropdown = () => {
  visible.value = false
}
const dropdownButtonRef = useTemplateRef('dropdownButtonRef')
useClickOutside(dropdownButtonRef, closeDropdown)
</script>
<template>
  <div ref="dropdownButtonRef" class="dropdown-button">
    <div class="header" @click="handleDropdown">
      <img src="@/assets/images/icon-ellipsis.svg" alt="ellipsis" />
    </div>
    <ul class="options" v-if="visible">
      <li
        v-for="option in options"
        :key="option.value"
        @click="handleSelect(option.value)"
        class="options__option"
        :class="{ 'options__option--delete': option.value === 'delete' }"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.dropdown-button {
  display: flex;
  position: relative;

  .header {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-12);
    padding: var(--spacing-12) var(--spacing-20);
    border-radius: var(--spacing-8);
    background-color: var(--color-white);
    box-shadow: 0 4px 24px 0 var(--color-shadow-2);
    white-space: nowrap;
    list-style: none;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    @include text.text-styles('text-preset-4');
    color: var(--color-grey-900);

    &__option {
      border-bottom: 1px solid var(--color-grey-100);
      padding-bottom: var(--spacing-12);
      cursor: pointer;

      &--delete {
        color: var(--color-red);
      }

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  }
}
</style>
