<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  placeholder?: string
}
withDefaults(defineProps<Props>(), {
  placeholder: 'Search',
})

const searchValue = ref<string>('')

const emit = defineEmits<{ search: [value: string] }>()

const handleSearch = () => {
  emit('search', searchValue.value)
}

watch(searchValue, (newValue: string) => {
  if (!newValue) {
    // 清空搜索输入框时，执行一次搜索
    emit('search', searchValue.value)
  }
})
</script>
<template>
  <div class="search">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="searchValue"
      @keyup.enter="handleSearch"
      id="search"
      name="search"
    />
    <div class="search__icon" @click="handleSearch">
      <img src="@/assets/images/icon-search.svg" alt="handleSearch" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search {
  display: flex;
  gap: var(--spacing-16);
  align-items: center;
  padding: var(--spacing-12) var(--spacing-20);
  border-radius: var(--spacing-8);
  background-color: var(--color-white);
  border: 1px solid var(--color-beige-500);
  max-width: 320px;
  cursor: pointer;
  input {
    border: none;
    outline: none;
    width: 50px; // 设置宽度（width:0也同样生效，）强制 input 依赖 flex 计算宽度，不设置该宽度，父组件无法让当前组件自适应宽度
    flex: 1;
    @include text.text-styles('text-preset-4');
    color: var(--color-grey-900);
    cursor: pointer;

    &::placeholder {
      color: var(--color-beige-500);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
  }
}
</style>
