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
  width?: string
  type?: string
  usedValues?: (string | number)[]
}
const props = withDefaults(defineProps<Props>(), {
  usedValues: () => [],
})

const isOpen = ref<boolean>(false)

const selected = defineModel<string | number>()
const selectedOption = computed(() =>
  props.options.find((option) => option.value === selected.value),
)
const originSelected = selected.value

const emit = defineEmits<{ select: [value: string | number] }>()
const handleSelect = (option: Option) => {
  if (hasPointer(option.value)) {
    isOpen.value = false
    selected.value = option.value
    emit('select', option.value) // 不要用selected.value
  }
}

const handleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 非手机媒介
const isNotMobileMedia = ref(useMediaQuery('(min-width: 577px)'))

// 是否根据手机媒介显示手机样式
const isMobile = computed(() => {
  return !isNotMobileMedia.value && props.imgSrc
})

const mobileImg = computed(() => {
  return isMobile.value ? useImageUrl(props.imgSrc ?? '').value : ''
})

const closeDropdown = () => {
  isOpen.value = false
}
const selectPickerRef = useTemplateRef('selectPickerRef')
useClickOutside(selectPickerRef, closeDropdown)

const isUsed = (value: string | number) => {
  return props.usedValues?.includes(value)
}

const hasPointer = (value: string | number) => {
  const isUsedValue = isUsed(value)
  return !isUsedValue || (isUsedValue && originSelected === value)
}
</script>
<template>
  <div class="select" ref="selectPickerRef">
    <div v-if="label && !isMobile" class="label">{{ label }}</div>
    <div class="wrapper">
      <div class="header vee-form" @click="handleDropdown" v-if="!isMobile">
        <span class="header__label">{{ selectedOption?.label }}</span>
        <div class="header__icon">
          <img src="@/assets/images/icon-caret-down.svg" alt="select" />
        </div>
      </div>
      <div class="header-img" v-if="isMobile" @click="handleDropdown">
        <img :src="mobileImg" alt="abbrev" />
      </div>
      <ul class="options" v-if="isOpen" :style="{ width: width }">
        <li v-if="isMobile" class="options__label">{{ label }}</li>
        <li
          v-for="option in options"
          :key="option.value"
          @click="handleSelect(option)"
          class="options__option"
          :class="{ 'options__option--has-pointer': hasPointer(option.value) }"
          :style="type && type === 'color' ? { '--color-theme': option.value } : {}"
        >
          <div
            class="options__option-circle"
            v-if="type && type === 'color'"
            :class="{ 'options__option-circle--used': !hasPointer(option.value) }"
          ></div>
          <div
            class="options__option-label"
            :class="{
              'options__option--selected': option.value === selected,
              'options__option-label--used': !hasPointer(option.value),
            }"
          >
            {{ option.label }}
          </div>
          <div
            v-if="type && type === 'color' && option.value === selected"
            class="options__option-color--selected"
          >
            <img src="@/assets/images/icon-selected.svg" alt="selected" />
          </div>
          <div
            v-if="
              isUsed(option.value) && option.value !== selected && option.value !== originSelected
            "
            class="options__option--used"
          >
            Aready Used
          </div>
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
    flex: 1;

    .header-img {
      display: flex;
      align-items: center;
    }

    .header {
      display: flex;
      flex: 1;
      gap: var(--spacing-16);
      align-items: center;
      padding: var(--spacing-12) var(--spacing-20);
      border-radius: var(--spacing-8);
      background-color: var(--color-white);
      border: 1px solid var(--color-beige-500);
      cursor: pointer;

      &__label {
        flex: 1;
        @include text.text-styles('text-preset-4');
        color: var(--color-grey-900);
      }

      &__icon {
        display: flex;
        align-items: center;
      }
    }

    .options {
      z-index: 1000;
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      // width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-12);
      padding: var(--spacing-12) var(--spacing-20);
      border-radius: var(--spacing-8);
      background-color: var(--color-white);
      box-shadow: 0 4px 24px 0 var(--color-shadow-2);
      // min-width: 114px;
      max-height: 60vh;
      overflow-y: auto;
      overscroll-behavior: contain; // 防止滚动穿透
      white-space: nowrap;
      list-style: none;
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-900);

      @media (min-width: 376px) {
        left: 0;
      }

      &__label {
        @include text.text-styles('text-preset-4');
        color: var(--color-grey-500);
        border-bottom: 1px solid var(--color-grey-100);
        padding-bottom: var(--spacing-12);
      }

      &__option {
        border-bottom: 1px solid var(--color-grey-100);
        padding-bottom: var(--spacing-12);
        display: flex;
        gap: var(--spacing-12);
        align-items: center;
        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        &-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--color-theme);
          &--used {
            opacity: 0.1;
          }
        }

        &-label {
          color: var(--color-grey-900);
          &--used {
            color: var(--color-grey-500);
          }
        }

        &--selected {
          @include text.text-styles('text-preset-4-bold');
        }

        &-color {
          &--selected {
            display: flex;
            align-items: center;
            margin-left: auto;
          }
        }

        &--used {
          @include text.text-styles('text-preset-5');
          color: var(--color-grey-500);
          margin-left: auto;
        }

        &--has-pointer {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
