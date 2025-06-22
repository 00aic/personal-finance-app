<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchInput from '@/components/SearchInput'
import SelectPicker from '@/components/SelectPicker'
import { SORT_OPTIONS } from '@/constants/sort'
import type { RecurringBill } from '@/types/RecurringBill'
import {
  getRecurringBills,
  getRecurringBillsByName,
  getRecurringBillsBySort,
} from '@/api/modules/recurringBills'
import { formatNumber } from '@/utils/numberUtils'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Sort } from '@/types/transaction'

const recurringBills = ref<RecurringBill[]>([])
onMounted(async () => {
  recurringBills.value = (await getRecurringBills()).data
})

const handleSearch = async (value: string) => {
  recurringBills.value = (await getRecurringBillsByName(value)).data
}

const sortValue = ref<string>('latest')
const handleSort = async (sort: string | number) => {
  recurringBills.value = (await getRecurringBillsBySort(sort as Sort)).data
}

const isWithLastFiveDays = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const fiveDaysAgo = new Date(now.getDate() - 5)
  return date >= fiveDaysAgo && date <= now
}

const billsWithSummary = computed(() => {
  return recurringBills.value.reduce(
    (acc, bill) => {
      acc['totalBills'] = (acc['totalBills'] ?? 0) + Number(bill.amount)
      if (bill.status === 'paid') {
        acc['paidBillsNumber'] = (acc['paidBillsNumber'] ?? 0) + 1
        acc['paidBillsAmount'] = (acc['paidBillsAmount'] ?? 0) + Number(bill.amount)
      }
      if (bill.status === 'due') {
        acc['dueBillsNumber'] = (acc['dueBillsNumber'] ?? 0) + 1
        acc['dueBillsAmount'] = (acc['dueBillsAmount'] ?? 0) + Number(bill.amount)
        if (isWithLastFiveDays(bill.date)) {
          acc['dueBillsLastFiveNumber'] = (acc['dueBillsLastFiveNumber'] ?? 0) + 1
          acc['dueBillsLastFiveAmount'] = (acc['dueBillsLastFiveAmount'] ?? 0) + Number(bill.amount)
        }
      }

      return acc
    },
    {} as Record<string, number>,
  )
})

// 格式化金额
const formatAmount = (amount: number) => {
  return formatNumber(amount, { currency: 'USD' })
}
</script>
<template>
  <div class="bills common-layout-page">
    <header class="header">Recurring Bills</header>
    <div class="content">
      <div class="total">
        <div class="total__icon">
          <img src="@/assets/images/icon-recurring-bills.svg" alt="total" />
        </div>
        <div class="total__bills">
          <div class="total__bills-label">Total bills</div>
          <div class="total__bills-value">{{ formatAmount(billsWithSummary.totalBills ?? 0) }}</div>
        </div>
      </div>
      <div class="summary">
        <div class="title">Summary</div>
        <div class="items">
          <div class="item">
            <div class="item__label">Paid Bills</div>
            <div class="item__value">
              {{
                `${billsWithSummary.paidBillsNumber ?? 0}(${formatAmount(billsWithSummary.paidBillsAmount ?? 0)})`
              }}
            </div>
          </div>
          <div class="item">
            <div class="item__label">Total Upcoming</div>
            <div class="item__value">
              {{
                `${billsWithSummary.dueBillsNumber ?? 0}(${formatAmount(billsWithSummary.dueBillsAmount ?? 0)})`
              }}
            </div>
          </div>
          <div class="item due">
            <div class="item__label">Due Soon</div>
            <div class="item__value">
              {{
                `${billsWithSummary.dueBillsLastFiveNumber ?? 0}(${formatAmount(billsWithSummary.dueBillsLastFiveAmount ?? 0)})`
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="details">
        <div class="actions">
          <SearchInput @search="handleSearch" class="actions__search" />
          <SelectPicker
            img-src="icon-sort-mobile.svg"
            label="Sort by"
            v-model="sortValue"
            :options="SORT_OPTIONS"
            @select="handleSort"
          />
        </div>
        <div class="session">
          <div class="item" v-for="(item, index) in recurringBills" :key="index">
            <div class="title">
              <div class="title__icon">
                <img :src="useImageUrl(item.avatar).value" alt="" />
              </div>
              <div class="title__name">{{ item.name }}</div>
            </div>
            <div class="value">
              <div class="due">
                <div class="due__date">{{ item.dueDate }}</div>
                <div class="due__icon">
                  <img
                    :src="
                      item.status === 'paid'
                        ? useImageUrl('icon-bill-paid.svg').value
                        : useImageUrl('icon-bill-due.svg').value
                    "
                    alt="paid"
                  />
                </div>
              </div>
              <div class="amount" :class="{ 'amount-due': item.status !== 'paid' }">
                {{ formatAmount(item.amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bills {
  .content {
    display: flex;
    gap: var(--spacing-12);
    flex-direction: column;

    .total {
      display: flex;
      gap: var(--spacing-20);
      align-items: center;
      padding: var(--spacing-24) var(--spacing-20);
      border-radius: var(--spacing-12);
      background-color: var(--color-grey-900);
      box-sizing: 0 8px 24px 0 var(--color-shadow-1);

      &__bills {
        display: flex;
        flex-direction: column;
        gap: 11px;
        color: var(--color-white);

        &-label {
          @include text.text-styles('text-preset-4');
        }
        &-value {
          @include text.text-styles('text-preset-1');
        }
      }
    }

    .summary {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-20);
      padding: var(--spacing-20);
      border-radius: var(--spacing-12);
      background-color: var(--color-white);
      box-shadow: 0 8px 24px 0 var(--color-shadow-1);

      .title {
        @include text.text-styles('text-preset-3');
        color: var(--color-grey-900);
      }

      .items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-16);

        .item {
          display: flex;
          justify-content: space-between;

          border-bottom: 1px solid color-mix(in srgb, var(--color-grey-500) 15%, transparent);
          padding-bottom: var(--spacing-16);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          &__label {
            @include text.text-styles('text-preset-5');
            color: var(--color-grey-500);
          }

          &__value {
            @include text.text-styles('text-preset-5-bold');
            color: var(--color-grey-900);
          }
        }
        .due {
          div {
            color: var(--color-red);
          }
        }
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-24);
      padding: var(--spacing-24) var(--spacing-20);
      border-radius: var(--spacing-12);
      background-color: var(--color-white);
      box-shadow: 0 8px 24px 0 var(--color-shadow-1);

      .actions {
        display: flex;
        gap: var(--spacing-24);

        &__search {
          flex: 1;
        }
      }

      .session {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-20);
        border-radius: var(--spacing-8);

        .item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);

          border-bottom: 1px solid var(--color-grey-100);
          padding-bottom: var(--spacing-20);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .title {
            display: flex;
            gap: var(--spacing-16);
            align-items: center;

            &__icon {
              width: 32px;
              height: 32px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            &__name {
              @include text.text-styles('text-preset-4-bold');
              color: var(--color-grey-900);
            }
          }

          .value {
            display: flex;
            justify-content: space-between;

            .due {
              display: flex;
              align-items: center;
              gap: var(--spacing-8);

              &__date {
                @include text.text-styles('text-preset-5');
                color: var(--color-green);
              }

              &__icon {
                display: flex;
                align-items: center;
              }
            }

            .amount {
              @include text.text-styles('text-preset-4-bold');
              color: var(--color-grey-900);

              &-due {
                color: var(--color-red);
              }
            }
          }
        }
      }
    }
  }
}
</style>
