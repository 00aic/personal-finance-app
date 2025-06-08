<script setup lang="ts">
import SearchInput from '@/components/SearchInput'
import SelectPicker from '@/components/SelectPicker'
import { ref } from 'vue'

const handleSearch = (value: string) => {
  console.log('搜索:', value)
}

const sortValue = ref<string>('All')

const sortOptions = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'a-z',
    value: 'a-z',
  },
]
const categoryValue = ref<string>('All')

const categoryOptions = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'a-z',
    value: 'a-z',
  },
]
</script>
<template>
  <div class="transactions common-layout-page">
    <header class="header">Transactions</header>
    <div class="content">
      <div class="actions">
        <SearchInput @search="handleSearch" class="actions__search" />
        <div class="actions__select">
          <SelectPicker
            img-src="icon-sort-mobile.svg"
            label="Sort by"
            v-model="sortValue"
            :options="sortOptions"
          />
          <!-- <div><img src="@/assets/images/icon-sort-mobile.svg" alt="sort" /></div> -->
          <SelectPicker
            img-src="icon-filter-mobile.svg"
            label="Category"
            v-model="categoryValue"
            :options="categoryOptions"
          />
        </div>
      </div>
      <div class="details">
        <div class="item">
          <div class="user">
            <div class="user__avatar">
              <img src="@/assets/images/avatars/emma-richardson.jpg" alt="avatar" />
            </div>
            <div class="user__info">
              <div class="user__info-name">Emma Richardson</div>
              <div class="user__info-category">General</div>
            </div>
          </div>
          <div class="value">
            <div class="value__amount">+$75.50</div>
            <div class="value__date">19 Aug 2024</div>
          </div>
        </div>

        <div class="item">
          <div class="user">
            <div class="user__avatar">
              <img src="@/assets/images/avatars/emma-richardson.jpg" alt="avatar" />
            </div>
            <div class="user__info">
              <div class="user__info-name">Emma Richardson</div>
              <div class="user__info-category">General</div>
            </div>
          </div>
          <div class="value">
            <div class="value__amount">+$75.50</div>
            <div class="value__date">19 Aug 2024</div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <div class="prev"><img src="@/assets/images/icon-caret-left.svg" alt="prev" /></div>
        <div class="page">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>
        <div class="next"><img src="@/assets/images/icon-caret-right.svg" alt="next" /></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.transactions {
  .content {
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    gap: var(--spacing-24);
    padding: var(--spacing-24) var(--spacing-20);
    border-radius: var(--spacing-12);

    .actions {
      display: flex;
      gap: var(--spacing-24);
      align-items: center;
      justify-content: space-between;

      &__search {
        flex: 1;
      }

      &__select {
        display: flex;
        gap: var(--spacing-24);
        align-items: center;
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-16);

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 1px solid var(--color-grey-100);
        padding-bottom: var(--spacing-16);

        &:last-child {
          border-bottom: none;
          padding-bottom: none;
        }

        .user {
          display: flex;
          gap: var(--spacing-12);
          align-items: center;

          &__avatar {
            width: 32px;
            height: 32px;
            display: flex;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          &__info {
            &-name {
              @include text.text-styles('text-preset-4-bold');
              color: var(--color-grey-900);
            }
            &-category {
              @include text.text-styles('text-preset-5');
              color: var(--color-grey-500);
            }
          }
        }

        .value {
          display: flex;
          flex-direction: column;
          align-items: end;

          &__amount {
            @include text.text-styles('text-preset-4-bold');
            color: var(--color-grey-900);
          }

          &__date {
            @include text.text-styles('text-preset-5');
            color: var(--color-grey-500);
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      padding-top: var(--spacing-24);

      .prev,
      .next,
      .page > div {
        padding: var(--spacing-16);
        border-radius: var(--spacing-8);
        border: 1px solid var(--color-beige-500);
        background-color: var(--color-white);
        height: 40px;
        display: flex;
        align-items: center;
      }

      .page {
        display: flex;
        gap: var(--spacing-8);
      }
    }
  }
}
</style>
