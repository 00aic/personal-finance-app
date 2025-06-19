<script setup lang="ts">
import { getTransactionsByPage } from '@/api/modules/transactions'
import SearchInput from '@/components/SearchInput'
import SelectPicker from '@/components/SelectPicker'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Transaction } from '@/types/transaction'
import { computed, onMounted, ref } from 'vue'
import { formatIntlDate } from '@/utils/dateUtils'
import { formatNumber } from '@/utils/numberUtils'
import { useRoute } from 'vue-router'
import { CATEGORY_OPTIONS_WITH_ALL } from '@/constants/categories'

const route = useRoute()

const searchValue = ref<string>()
// 搜索
const handleSearch = async (value: string) => {
  searchValue.value = value
  await getTransactions()
}

const sortValue = ref<string>('latest')

const sortOptions = [
  {
    label: 'Latest',
    value: 'latest',
  },
  {
    label: 'Oldest',
    value: 'oldest',
  },
  {
    label: 'A to Z',
    value: 'az',
  },
  {
    label: 'Z to A',
    value: 'za',
  },
  {
    label: 'Highest',
    value: 'highest',
  },
  {
    label: 'Lowest',
    value: 'lowest',
  },
]
// 排序
const handleSort = async () => {
  await getTransactions()
}

const categoryValue = ref<string>('all')

// 按分类过滤
const handleFilterCategory = async () => {
  await getTransactions()
}
// 页码
const curentPage = ref<number>(1)
// 每页显示条数
const pageSize = ref<number>(10)
// 总页数
const totalPage = ref<number>(1)
// 数据对象
const transactions = ref<Transaction[]>([])
// 获取数据
const getTransactions = async () => {
  const result = (
    await getTransactionsByPage({
      page: curentPage.value,
      pageSize: pageSize.value,
      sort: sortValue.value,
      category: categoryValue.value,
      search: searchValue.value,
    })
  ).data
  transactions.value = result.data
  totalPage.value = Math.ceil(result.total / pageSize.value)
}
onMounted(async () => {
  if (route.query.category) {
    categoryValue.value = route.query.category as string
  }

  await getTransactions()
})
// 上一页
const handlePrevPage = async () => {
  if (curentPage.value > 1) {
    curentPage.value--
    if (curentPage.value < startPage.value) {
      startPage.value = curentPage.value
    }
    await getTransactions()
  }
}
// 下一页
const handleNextPage = async () => {
  if (curentPage.value < totalPage.value) {
    curentPage.value++
    if (curentPage.value === showEllipsisIndex.value && startPage.value === 1) {
      startPage.value++
    }
    await getTransactions()
  }
}
// 处理选中对应页码
const handleSelectPage = async (page: number) => {
  curentPage.value = page
  await getTransactions()
}
// 界面总共显示的页码按钮数，默认手机下为4个按钮数
const showPageNumber = ref<number>(4)
// 需要显示页码省略号的位置索引，1开始
const showEllipsisIndex = ref<number>(showPageNumber.value / 2 + 1)
// 开始页码
const startPage = ref<number>(1)

// 获取要显示的页码内容
const pageList = computed(() => {
  const pageList = []
  const tempTotalPage = totalPage.value - (startPage.value - 1)
  if (tempTotalPage <= showPageNumber.value) {
    for (let index = startPage.value; index <= tempTotalPage; index++) {
      pageList.push({ type: 'page', value: index })
    }
  } else {
    for (let index = startPage.value; index < showPageNumber.value; index++) {
      if (index === showEllipsisIndex.value) {
        pageList.push({ type: 'ellipsis', value: 0 })
      } else {
        pageList.push({ type: 'page', value: index })
      }
    }
  }
  if (tempTotalPage !== 1) {
    pageList.push({ type: 'page', value: totalPage.value })
  }
  return pageList
})
// 处理省略号页码逻辑
const handleShowEllipsisPage = async () => {
  startPage.value++
  if (curentPage.value < startPage.value) {
    curentPage.value++
    await getTransactions()
  }
}
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
            @select="handleSort"
          />
          <!-- <div><img src="@/assets/images/icon-sort-mobile.svg" alt="sort" /></div> -->
          <SelectPicker
            img-src="icon-filter-mobile.svg"
            label="Category"
            v-model="categoryValue"
            :options="CATEGORY_OPTIONS_WITH_ALL"
            @select="handleFilterCategory"
          />
        </div>
      </div>
      <div class="details">
        <div class="item" v-for="(item, index) in transactions" :key="index">
          <div class="user">
            <div class="user__avatar">
              <img :src="useImageUrl(item.avatar).value" alt="avatar" />
            </div>
            <div class="user__info">
              <div class="user__info-name">{{ item.name }}</div>
              <div class="user__info-category">{{ item.category }}</div>
            </div>
          </div>
          <div class="value">
            <div class="value__amount" :class="{ positive: item.amount >= 0 }">
              {{
                item.amount > 0
                  ? '+' + formatNumber(item.amount, { currency: 'USD' })
                  : formatNumber(item.amount, { currency: 'USD' })
              }}
            </div>
            <div class="value__date">{{ formatIntlDate(item.date) }}</div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <div class="prev" @click="handlePrevPage">
          <img src="@/assets/images/icon-caret-left.svg" alt="prev" />
        </div>
        <div class="page">
          <template v-for="page in pageList" :key="`page${page.value}`">
            <div
              v-if="page.type === 'page'"
              @click="handleSelectPage(Number(page.value))"
              :class="{ active: page.value === curentPage }"
            >
              {{ page.value }}
            </div>
            <div v-else>
              <img
                src="@/assets/images/icon-ellipsis.svg"
                alt="ellipsis"
                @click="handleShowEllipsisPage"
              />
            </div>
          </template>
        </div>
        <div class="next" @click="handleNextPage">
          <img src="@/assets/images/icon-caret-right.svg" alt="next" />
        </div>
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

          .positive {
            color: var(--color-green);
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
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .page {
        display: flex;
        gap: var(--spacing-8);
        @include text.text-styles('text-preset-4');
        color: var(--color-grey-900);

        .active {
          background-color: var(--color-grey-900);
          color: var(--color-white);
        }
      }
    }
  }
}
</style>
