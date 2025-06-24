<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BudgetsDoughnut from '@/components/BudgetsDoughnut'
import type { Balance } from '@/types/balance'
import { getBalance } from '@/api/modules/balance'
import { formatNumber } from '@/utils/numberUtils'
import type { Pot } from '@/types/pot'
import { getPots } from '@/api/modules/pots'
import { useRouter } from 'vue-router'
import type { Transaction } from '@/types/transaction'
import { getTransactionsByPage } from '@/api/modules/transactions'
import { formatIntlDate } from '@/utils/dateUtils'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Budget } from '@/types/budget'
import { getBudgets } from '@/api/modules/budgets'
import type { RecurringBill } from '@/types/recurringBill'
import { useBillsSummary } from '@/composables/useBillsSummary'
import { getRecurringBills } from '@/api/modules/recurringBills'
import { useBudgetsChart } from '@/composables/useBudgetsChart'

const router = useRouter()

const balance = ref<Balance>()
const pots = ref<Pot[]>([])
const transactions = ref<Transaction[]>([])
const budgets = ref<Budget[]>([])
const recurringBills = ref<RecurringBill[]>([])

onMounted(async () => {
  balance.value = (await getBalance()).data
  pots.value = (await getPots()).data
  transactions.value = (
    await getTransactionsByPage({
      page: 1,
      pageSize: 5,
    })
  ).data.data
  budgets.value = budgets.value = (await getBudgets()).data
  recurringBills.value = (await getRecurringBills()).data
})
const potsWithTotalSaved = computed(() => {
  const allTotalSaved = pots.value?.reduce((acc, pot) => {
    acc += pot.total ?? 0
    return acc
  }, 0)
  return {
    data: pots.value?.slice(0, 4),
    totalSaved: allTotalSaved,
  }
})

// 格式化金额
const formatAmount = (amount: number) => {
  return formatNumber(amount, { currency: 'USD' })
}

const handlePotsDetails = () => {
  router.push({ name: 'Pots' })
}

const handleTransactionsAll = () => {
  router.push({ name: 'Transactions' })
}
const budgetsToShow = computed(() => budgets.value.slice(0, 4))

const { chartData, chartLimit, chartSpent } = useBudgetsChart(budgets)

const handleBudgetsDetails = () => {
  router.push({ name: 'Budgets' })
}

const billsWithSummary = useBillsSummary(recurringBills)
const handleRecurringBillsDetails = () => {
  router.push({ name: 'Recurring bills' })
}
</script>
<template>
  <div class="overview common-layout-page">
    <header class="header">Overview</header>

    <div class="total">
      <div class="total__balance">
        <div class="total__balance-label">Current Balance</div>
        <div class="total__balance-value">{{ formatAmount(balance?.current ?? 0) }}</div>
      </div>
      <div class="total__income">
        <div class="total__income-label">Income</div>
        <div class="total__income-value">{{ formatAmount(balance?.income ?? 0) }}</div>
      </div>
      <div class="total__expenses">
        <div class="total__expenses-label">Expenses</div>
        <div class="total__expenses-value">{{ formatAmount(balance?.expenses ?? 0) }}</div>
      </div>
    </div>

    <div class="pots">
      <div class="session-header">
        <div class="session-header__title">Pots</div>
        <div class="session-header__action" @click="handlePotsDetails">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="total">
        <div class="total__icon"><img src="@/assets/images/icon-pot.svg" alt="pot" /></div>
        <div class="total__content">
          <div class="total__content-label">Total Saved</div>
          <div class="total__content-value">
            {{ formatAmount(potsWithTotalSaved.totalSaved ?? 0) }}
          </div>
        </div>
      </div>
      <div class="grid-details">
        <div
          class="grid-details__item"
          v-for="(item, index) in potsWithTotalSaved.data"
          :key="`pot-${index}`"
          :style="{ '--color-budget-border': item.theme }"
        >
          <div class="grid-details__item-label">{{ item.name }}</div>
          <div class="grid-details__item-value">{{ formatAmount(item.total ?? 0) }}</div>
        </div>
      </div>
    </div>

    <div class="transactions">
      <div class="session-header">
        <div class="session-header__title">Tranctions</div>
        <div class="session-header__action" @click="handleTransactionsAll">
          <div>View All</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="details">
        <div class="item" v-for="(item, index) in transactions" :key="`transaction-${index}`">
          <div class="item__user">
            <div class="item__user-avatar">
              <img :src="useImageUrl(item.avatar).value" alt="avatars" />
            </div>
            <div class="item__user-name">{{ item.name }}</div>
          </div>
          <div class="item__content">
            <div class="item__content-value" :class="{ positive: item.amount >= 0 }">
              {{ item.amount > 0 ? '+' : '' }}{{ formatAmount(item.amount) }}
            </div>
            <div class="item__content-time">{{ formatIntlDate(item.date) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="budgets">
      <div class="session-header">
        <div class="session-header__title">Budgets</div>
        <div class="session-header__action" @click="handleBudgetsDetails">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <BudgetsDoughnut :data="chartData" :limit="chartLimit" :spent="chartSpent" />
      <div class="grid-details">
        <div
          class="grid-details__item"
          v-for="(item, index) in budgetsToShow"
          :key="`budget-${index}`"
          :style="{ '--color-budget-border': item.theme }"
        >
          <div class="grid-details__item-label">{{ item.category }}</div>
          <div class="grid-details__item-value">{{ formatAmount(item.spent ?? 0) }}</div>
        </div>
      </div>
    </div>

    <div class="recurring-bills">
      <div class="session-header">
        <div class="session-header__title">Recurring Bills</div>
        <div class="session-header__action" @click="handleRecurringBillsDetails">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="details">
        <div class="details__item details__paid">
          <div class="details__item-label">Paid Bills</div>
          <div class="details__item-value">
            {{ formatAmount(billsWithSummary.paidBillsAmount ?? 0) }}
          </div>
        </div>
        <div class="details__item details__upcoming">
          <div class="details__item-label">Total Upcoming</div>
          <div class="details__item-value">
            {{ formatAmount(billsWithSummary.dueBillsAmount ?? 0) }}
          </div>
        </div>
        <div class="details__item details__due">
          <div class="details__item-label">Due Soon</div>
          <div class="details__item-value">
            {{ formatAmount(billsWithSummary.dueBillsLastFiveAmount ?? 0) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.overview {
  .session-header {
    display: flex;
    justify-content: space-between;

    &__title {
      @include text.text-styles('text-preset-2');
      color: var(--color-grey-900);
    }

    &__action {
      display: flex;
      @include text.text-styles('text-preset-4');
      color: var(--color-grey-500);
      gap: var(--spacing-12);
    }
  }

  .grid-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-16);

    &__item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      position: relative;
      padding-left: var(--spacing-16);

      &::before {
        content: '';
        width: 4px;
        background-color: var(--color-budget-border);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: var(--spacing-8);
        z-index: 0;
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
  }

  .total {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-12);

    &__balance,
    &__income,
    &__expenses {
      display: flex;
      flex-direction: column;
      border-radius: var(--spacing-12);
      box-shadow: 0 var(--spacing-8) var(--spacing-24) 0 var(--color-shadow-1);
      padding: var(--spacing-20);
      gap: var(--spacing-12);

      &-label {
        @include text.text-styles('text-preset-4');
      }

      &-value {
        @include text.text-styles('text-preset-1');
      }
    }

    &__balance {
      background-color: var(--color-grey-900);
      color: var(--color-white);
    }
    &__income,
    &__expenses {
      background-color: var(--color-white);

      &-label {
        color: var(--color-grey-500);
      }

      &-value {
        color: var(--color-grey-900);
      }
    }
  }
  .pots,
  .transactions,
  .budgets,
  .recurring-bills {
    background-color: var(--color-white);
    padding: var(--spacing-24) var(--spacing-20);
    border-radius: var(--spacing-12);
    box-shadow: 0 var(--spacing-8) var(--spacing-24) 0 var(--color-shadow-1);
    display: flex;
    flex-direction: column;
  }

  .pots {
    gap: var(--spacing-20);

    .total {
      display: flex;
      flex-direction: row;
      padding: var(--spacing-16);
      gap: var(--spacing-16);
      background-color: var(--color-beige-100);
      border-radius: var(--spacing-12);
      box-shadow: 0 var(--spacing-8) var(--spacing-24) 0 var(--color-shadow-1);

      &__icon {
        display: flex;
        align-items: center;
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: 11px;
        &-label {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
        }
        &-value {
          @include text.text-styles('text-preset-1');
          color: var(--color-grey-900);
        }
      }
    }
  }

  .transactions {
    gap: var(--spacing-32);

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-20);

      .item {
        display: flex;
        justify-content: space-between;

        border-bottom: 1px solid var(--color-grey-100);
        padding-bottom: var(--spacing-20);

        &:last-child {
          border-bottom: none;
          padding-bottom: none;
        }

        &__user {
          display: flex;
          gap: var(--spacing-16);

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
            @include text.text-styles('text-preset-4-bold');
            color: var(--color-grey-900);
          }
        }

        &__content {
          display: flex;
          flex-direction: column;
          align-items: end;
          &-value {
            @include text.text-styles('text-preset-4-bold');
            color: var(--color-grey-900);
          }
          .positive {
            color: var(--color-green);
          }
          &-time {
            @include text.text-styles('text-preset-5');
            color: var(--color-grey-500);
          }
        }
      }
    }
  }

  .recurring-bills {
    gap: var(--spacing-32);

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-12);

      &__item {
        display: flex;
        justify-content: space-between;
        border-radius: var(--spacing-8);
        border-left: 4px solid var(--color-green);
        padding: var(--spacing-20) var(--spacing-16);
        background-color: var(--color-beige-100);
        &-label {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
        }
        &-value {
          @include text.text-styles('text-preset-4-bold');
          color: var(--color-grey-900);
        }
      }

      &__paid {
        border-left-color: var(--color-green);
      }
      &__upcoming {
        border-left-color: var(--color-yellow);
      }
      &__due {
        border-left-color: var(--color-cyan);
      }
    }
  }
}
</style>
