<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useImageUrl } from '@/composables/useImageUrl'
import { useClickOutside } from '@/composables/useClickOutside'

interface Option {
  value: string | number
  label: string
}
interface Props {
  options: Option[]
  label?: string
  imgSrc?: string
}
const props = defineProps<Props>()

const isOpen = ref<boolean>(false)

const selected = defineModel<string | number>()
const selectedOption = computed(() =>
  props.options.find((option) => option.value === selected.value),
)

const handleSelect = (option: Option) => {
  isOpen.value = false
  selected.value = option.value
}

const handleDropdown = () => {
  isOpen.value = !isOpen.value
}

const isMobile = useMediaQuery('(max-width: 375px)')
console.log('isMobile', isMobile)

const mobileImg = computed(() => {
  return isMobile.value ? useImageUrl(props.imgSrc ?? '').value : ''
})

const closeDropdown = () => {
  isOpen.value = false
}
const selectPickerRef = useTemplateRef('selectPickerRef')
useClickOutside(selectPickerRef, closeDropdown)
</script>
<template>
  <div class="select" ref="selectPickerRef">
    <div v-if="label && !isMobile" class="label">{{ label }}</div>
    <div class="wrapper">
      <div class="header" @click="handleDropdown" v-if="!isMobile">
        <span class="header__label">{{ selectedOption?.label }}</span>
        <div class="header__icon">
          <img src="@/assets/images/icon-caret-down.svg" alt="select" />
        </div>
      </div>
      <div class="header-img" v-if="isMobile" @click="handleDropdown">
        <img :src="mobileImg" alt="abbrev" />
      </div>
      <ul class="options" v-if="isOpen">
        <li
          v-for="option in options"
          :key="option.value"
          @click="handleSelect(option)"
          class="options__option"
          :class="{ options__selected: option.value === selected }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.select {
  display: flex;
  gap: var(--spacing-8);
  align-items: center;

  .label {
    @include text.text-styles('text-preset-4');
    color: var(--color-grey-500);
  }

  .wrapper {
    position: relative;
    display: flex;

    .header-img {
      display: flex;
      align-items: center;
    }

    .header {
      display: flex;
      gap: var(--spacing-16);
      align-items: center;
      padding: var(--spacing-12) var(--spacing-20);
      border-radius: var(--spacing-8);
      background-color: var(--color-white);
      border: 1px solid var(--color-beige-500);

      &__label {
        @include text.text-styles('text-preset-4');
        color: var(--color-grey-900);
      }

      &__icon {
        display: flex;
        align-items: center;
      }
    }

    .options {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-12);
      padding: var(--spacing-12) var(--spacing-20);
      border-radius: var(--spacing-8);
      background-color: var(--color-white);
      box-shadow: 0 4px 24px 0 var(--color-shadow-2);
      width: 100%;
      min-width: 114px;
      list-style: none;
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-900);

      @media (min-width: 376px) {
        left: 0;
      }

      &__option {
        border-bottom: 1px solid var(--color-grey-100);
        padding-bottom: var(--spacing-12);
        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      }

      &__selected {
        @include text.text-styles('text-preset-4-bold');
      }
    }
  }
}
</style>
