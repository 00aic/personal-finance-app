<script setup lang="ts">
import {
  addBudget,
  deleteBudgetWithCategory,
  getBudgetsWithTransactions,
  updateBudget,
} from '@/api/modules/budgets'
import BudgetsDoughnut from '@/components/BudgetsDoughnut'
import type { Budget } from '@/types/budget'
import { computed, onMounted, ref } from 'vue'
import { formatNumber } from '@/utils/numberUtils'
import { formatIntlDate } from '@/utils/dateUtils'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Category } from '@/types/transaction'
import { useRouter } from 'vue-router'
import DropdownButton from '@/components/DropdownButton'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import UpsertBudget from './UpsertBudget.vue'
import { useBudgetsChart } from '@/composables/useBudgetsChart'

const router = useRouter()

const budgets = ref<Budget[]>([])
const getBudgets = async () => {
  budgets.value = (await getBudgetsWithTransactions()).data
}
onMounted(async () => {
  await getBudgets()
})

const { chartData, chartLimit, chartSpent } = useBudgetsChart(budgets)

const budgetsWithProgress = computed(() => {
  return budgets.value.map((item) => {
    const remaining = item.maximum - (item.spent ?? 0)
    return {
      ...item,
      remaining: remaining < 0 ? 0 : remaining,
      progressPercentage: Math.min(((item.spent ?? 0) / item.maximum) * 100, 100),
    }
  })
})

// 格式化金额
const formatAmount = (amount: number) => {
  return formatNumber(amount, { currency: 'USD' })
}
const handleSeeAll = (category: Category) => {
  router.push({
    name: 'Transactions',
    query: {
      category: category,
    },
  })
}

const showAddDialog = ref<boolean>(false)
const handleShowAddDialog = () => {
  showAddDialog.value = true
}

const handleBudgetAdd = async (budget: Budget) => {
  await addBudget(budget)
  await getBudgets()
}

// 操作按钮下拉选项
const actionOptions = [
  {
    label: 'Edit Pot',
    value: 'edit',
  },
  {
    label: 'Delete Pot',
    value: 'delete',
  },
]
// 是否显示删除提示框
const showDeleteDialog = ref<boolean>(false)
// 是否显示编辑框
const showEditDialog = ref<boolean>(false)
const currentItem = ref<Budget>({})
const handleActions = (selected: string, item: Budget) => {
  currentItem.value = item
  // 删除操作
  if ('delete' === selected) {
    showDeleteDialog.value = true
  } else {
    // 编辑操作
    showEditDialog.value = true
  }
}
const handleBudgetDelete = async (category: Category) => {
  await deleteBudgetWithCategory(category)
  await getBudgets()
}

const handleBudgetUpdate = async (budget: Budget) => {
  await updateBudget(budget)
  await getBudgets()
}
</script>
<template>
  <div class="budgets common-layout-page">
    <div class="head">
      <header class="header">Budgets</header>
      <button class="add" @click="handleShowAddDialog">+Add New Budget</button>
    </div>

    <UpsertBudget v-model="showAddDialog" @upsert="handleBudgetAdd" />

    <div class="summary">
      <BudgetsDoughnut :data="chartData" :limit="chartLimit" :spent="chartSpent" />
      <div class="spending">
        <div class="sp-header">Spending Summary</div>
        <div class="sp-header__details">
          <div
            class="sp-item"
            v-for="(item, index) in budgetsWithProgress"
            :key="`budget-${index}`"
            :style="{ '--color-budget-border': item.theme }"
          >
            <div class="sp-item__label">{{ item.category }}</div>
            <div class="sp-item__value">
              <span class="sp-item__value-spent">{{ formatAmount(item.spent ?? 0) }}</span>
              <span class="sp-item__value-total">of {{ formatAmount(item.maximum) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="details"
      v-for="(item, index) in budgetsWithProgress"
      :key="index"
      :style="{ '--color-budget-progress': item.theme }"
    >
      <div class="header">
        <div class="header__title">
          <div class="header__title-circle"></div>
          <div class="header__title-name">{{ item.category }}</div>
        </div>
        <DropdownButton
          :options="actionOptions"
          @select="(selected) => handleActions(selected, item)"
        />
      </div>

      <div class="amount">
        <div class="maximum">Maximum of ${{ item.maximum }}</div>
        <div class="progress">
          <div class="progress__fill" :style="{ width: `${item.progressPercentage}%` }"></div>
        </div>
        <div class="detail">
          <div class="detail__spent">
            <div class="detail__spent-label">Spent</div>
            <div class="detail__spent-value">
              {{ formatAmount(item.spent ?? 0) }}
            </div>
          </div>
          <div class="detail__remaining">
            <div class="detail__remaining-label">Remaining</div>
            <div class="detail__remaining-value">
              {{ formatAmount(item.remaining) }}
            </div>
          </div>
        </div>
      </div>

      <div class="latest">
        <div class="l-header">
          <div class="l-header__title">Latest Spending</div>
          <div class="l-header__action" @click="handleSeeAll(item.category)">
            <div>See All</div>
            <div><img src="@/assets/images/icon-caret-right.svg" alt="more" /></div>
          </div>
        </div>
        <div class="l-items">
          <div class="l-item" v-for="(trac, index) in item.transactions" :key="`trac${index}`">
            <div class="l-item__user">
              <div class="l-item__user-avatar">
                <img :src="useImageUrl(trac.avatar).value" alt="avatar" />
              </div>
              <div class="l-item__user-name">{{ trac.name }}</div>
            </div>
            <div class="l-item__content">
              <div class="l-item__content-value">
                {{ formatAmount(trac.amount) }}
              </div>
              <div class="l-item__content-time">{{ formatIntlDate(trac.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmationDialog
      v-model="showDeleteDialog"
      :title="`Delete '${currentItem.category}'?`"
      message="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
      confirm-text="Yes, Confirm Deletion"
      cancel-text="No, Go Back"
      @confirm="handleBudgetDelete(currentItem.category)"
    />

    <UpsertBudget :data="currentItem" v-model="showEditDialog" @upsert="handleBudgetUpdate" />
  </div>
</template>
<style lang="scss" scoped>
.budgets {
  .head {
    display: flex;
    justify-content: space-between;
    .add {
      padding: var(--spacing-16);
      border-radius: var(--spacing-8);
      background-color: var(--color-grey-900);
      border: 1px solid var(--color-grey-200);
      @include text.text-styles('text-preset-4-bold');
      color: var(--color-white);
    }
  }

  .summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-32);
    padding: var(--spacing-20) var(--spacing-24);
    border-radius: var(--spacing-12);
    background-color: var(--color-white);
    box-shadow: 0 8px 24px 0 var(--color-shadow-1);

    .spending {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-24);

      .sp-header {
        @include text.text-styles('text-preset-2');
        color: var(--color-grey-900);
        &__details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-16);

          .sp-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            padding-left: var(--spacing-16);

            &::before {
              content: '';
              top: 0;
              left: 0;
              bottom: var(--spacing-16); // 从底部向上缩进,避免左边框高度把padding-bottom也算上了
              border-radius: var(--spacing-8);
              border-left: 4px solid var(--color-budget-border);
              position: absolute;
            }

            border-bottom: 1px solid var(--color-grey-100);
            padding-bottom: var(--spacing-16);

            &:last-child {
              border-bottom: none;
              padding-bottom: 0;

              &::before {
                bottom: 0;
              }
            }

            &__label {
              @include text.text-styles('text-preset-4');
              color: var(--color-grey-500);
            }
            &__value {
              display: flex;
              gap: var(--spacing-8);
              align-items: center;
              &-spent {
                @include text.text-styles('text-preset-3');
                color: var(--color-grey-900);
              }
              &-total {
                @include text.text-styles('text-preset-5');
                color: var(--color-grey-500);
              }
            }
          }
        }
      }
    }
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-20);
    padding: var(--spacing-24) var(--spacing-20);
    border-radius: var(--spacing-12);
    background-color: var(--color-white);
    box-shadow: 0 8px 24px 0 var(--color-shadow-1);

    .header {
      display: flex;
      justify-content: space-between;

      &__title {
        display: flex;
        gap: var(--spacing-16);
        align-items: center;

        &-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--color-budget-progress);
        }
        &-name {
          @include text.text-styles('text-preset-2');
          color: var(--color-grey-900);
        }
      }
    }

    .amount {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-16);

      .maximum {
        @include text.text-styles('text-preset-4');
        color: var(--color-grey-500);
      }

      .progress {
        height: 32px;
        padding: var(--spacing-4);
        border-radius: var(--spacing-4);
        background-color: var(--color-beige-100);

        &__fill {
          height: 100%;
          border-radius: var(--spacing-4);
          background-color: var(--color-budget-progress);
        }
      }

      .detail {
        display: flex;

        &__spent,
        &__remaining {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          padding-left: var(--spacing-16);
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            border-radius: var(--spacing-8);
            width: 4px;
          }

          &-label {
            @include text.text-styles('text-preset-5');
            color: var(--color-grey-500);
          }

          &-value {
            @include text.text-styles('text-preset-4-bold');
            color: var(--color-grey-900);
          }
        }

        &__spent {
          &::before {
            background-color: var(--color-budget-progress);
          }
        }
        &__remaining {
          &::before {
            background-color: var(--color-beige-100);
          }
        }
      }
    }

    .latest {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-20);
      padding: var(--spacing-16);
      border-radius: var(--spacing-12);
      background-color: var(--color-beige-100);
      box-shadow: 0 8px 24px 0 var(--color-shadow-1);

      .l-header {
        display: flex;
        justify-content: space-between;

        &__title {
          @include text.text-styles('text-preset-3');
          color: var(--color-grey-900);
        }
        &__action {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
          display: flex;
          gap: var(--spacing-12);
        }
      }

      .l-items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-12);

        .l-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          border-bottom: 1px solid color-mix(in srgb, var(--color-grey-500) 15%, transparent);
          padding-bottom: var(--spacing-12);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          &__user {
            display: flex;
            gap: var(--spacing-16);
            align-items: center;
            &-avatar {
              width: 32px;
              height: 32px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            &-name {
              @include text.text-styles('text-preset-5-bold');
              color: var(--color-grey-900);
            }
          }

          &__content {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-4);
            align-items: end;

            &-value {
              @include text.text-styles('text-preset-5-bold');
              color: var(--color-grey-900);
            }
            &-time {
              @include text.text-styles('text-preset-5');
              color: var(--color-grey-500);
            }
          }
        }
      }
    }
  }
}
</style>
