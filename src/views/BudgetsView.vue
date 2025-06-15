<script setup lang="ts">
import { getBudgetsWithTransactions } from '@/api/modules/budgets'
import BudgetsDoughnut from '@/components/BudgetsDoughnut'
import type { Budget } from '@/types/budget'
import { computed, onMounted, ref } from 'vue'
import { formatNumber } from '@/utils/numberUtils'
import { formatIntlDate } from '@/utils/dateUtils'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Category } from '@/types/transaction'
import { useRouter } from 'vue-router'

const router = useRouter()

const budgets = ref<Budget[]>([])
onMounted(async () => {
  budgets.value = (await getBudgetsWithTransactions()).data
})

const chartData = computed(() => ({
  labels: budgetsWithProgress.value.map((item) => item.category),
  datasets: [
    {
      data: budgetsWithProgress.value.map((item) => item.spent ?? 0),
      backgroundColor: budgetsWithProgress.value.map((item) => item.theme),
      hoverBackgroundColor: budgetsWithProgress.value.map((item) => item.theme + 'CC'),
      borderWidth: 0,
      cutout: '60%',
      hoverOffset: budgetsWithProgress.value.length,
    },
  ],
}))
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
// 图标总花费数
const chartLimit = computed(() =>
  budgetsWithProgress.value.reduce((sum, item) => sum + item.maximum, 0),
)
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

const handleActions = () => {}
</script>
<template>
  <div class="budgets common-layout-page">
    <div class="head">
      <header class="header">Budgets</header>
      <button class="add">+Add New Budget</button>
    </div>

    <div class="summary">
      <BudgetsDoughnut :data="chartData" :limit="chartLimit" />
      <div class="spending">
        <div class="header">Spending Summary</div>
        <div class="details">
          <div
            class="item"
            v-for="(item, index) in budgetsWithProgress"
            :key="`budget-${index}`"
            :style="{ '--color-budget-border': item.theme }"
          >
            <div class="item__label">{{ item.category }}</div>
            <div class="item__value">
              <span class="item__value-spent">{{ formatAmount(item.spent ?? 0) }}</span>
              <span class="item__value-total">of {{ formatAmount(item.maximum) }}</span>
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
        <div class="header__more" @click="handleActions">
          <img src="@/assets/images/icon-ellipsis.svg" alt="ellipsis" />
        </div>
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
        <div class="header">
          <div class="header__title">Latest Spending</div>
          <div class="header__action" @click="handleSeeAll(item.category)">
            <div>See All</div>
            <div><img src="@/assets/images/icon-caret-right.svg" alt="more" /></div>
          </div>
        </div>
        <div class="items">
          <div class="item" v-for="(trac, index) in item.transactions" :key="`trac${index}`">
            <div class="item__user">
              <div class="item__user-avatar">
                <img :src="useImageUrl(trac.avatar).value" alt="avatar" />
              </div>
              <div class="item__user-name">{{ trac.name }}</div>
            </div>
            <div class="item__content">
              <div class="item__content-value">
                {{ formatAmount(trac.amount) }}
              </div>
              <div class="item__content-time">{{ formatIntlDate(trac.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

      .header {
        @include text.text-styles('text-preset-2');
        color: var(--color-grey-900);
      }
      .details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-16);

        .item {
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

      &__more {
        display: flex;
        align-items: center;
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

      .header {
        display: flex;

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

      .items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-12);

        .item {
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
