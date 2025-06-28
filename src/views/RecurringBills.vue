<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SearchInput from '@/components/search-input'
import SelectPicker from '@/components/select-picker'
import { SORT_OPTIONS } from '@/constants/sort'
import type { RecurringBill } from '@/types/recurringBill'
import {
  getRecurringBills,
  getRecurringBillsByName,
  getRecurringBillsBySort,
} from '@/api/modules/recurringBills'
import { formatNumber } from '@/utils/numberUtils'
import { useImageUrl } from '@/composables/useImageUrl'
import type { Sort } from '@/types/transaction'
import { useBillsSummary } from '@/composables/useBillsSummary'

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

const billsWithSummary = useBillsSummary(recurringBills)

// 格式化金额
const formatAmount = (amount: number) => {
  return formatNumber(amount, { currency: 'USD' })
}
</script>
<template>
  <div class="bills common-layout-page">
    <header class="header">Recurring Bills</header>
    <div class="content">
      <div class="all">
        <div class="total">
          <div class="total__icon">
            <img src="@/assets/images/icon-recurring-bills.svg" alt="total" />
          </div>
          <div class="total__bills">
            <div class="total__bills-label">Total bills</div>
            <div class="total__bills-value">
              {{ formatAmount(billsWithSummary.totalBills ?? 0) }}
            </div>
          </div>
        </div>
        <div class="summary">
          <div class="summary-title">Summary</div>
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
          <div class="session-title">
            <div></div>
            <div class="session-title__bill">Bill Title</div>
            <div class="session-title__due">Due Date</div>
            <div class="session-title__amount">Amount</div>
          </div>
          <div class="item" v-for="(item, index) in recurringBills" :key="index">
            <div class="item__icon">
              <img :src="useImageUrl(item.avatar).value" alt="" />
            </div>
            <div class="item__name">{{ item.name }}</div>
            <div class="item__due">
              <div class="item__due-date">{{ item.dueDate }}</div>
              <div class="item__due-icon">
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
            <div class="item__amount" :class="{ 'item__amount-due': item.status !== 'paid' }">
              {{ formatAmount(item.amount) }}
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
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-24);

    .all {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-12);
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

        &-title {
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
        justify-content: space-between;
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

        &-title {
          display: none;
        }

        .item {
          display: grid;
          grid-template-columns: 32px 3fr 1fr;
          grid-template-areas:
            'icon name .'
            'due due amount';
          gap: var(--spacing-16);
          align-items: center;

          border-bottom: 1px solid var(--color-grey-100);
          padding-bottom: var(--spacing-20);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          &__icon {
            grid-area: icon;
            width: 32px;
            height: 32px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          &__name {
            grid-area: name;

            @include text.text-styles('text-preset-4-bold');
            color: var(--color-grey-900);
          }

          &__due {
            grid-area: due;
            display: flex;
            align-items: center;
            gap: var(--spacing-8);

            &-date {
              @include text.text-styles('text-preset-5');
              color: var(--color-green);
            }

            &-icon {
              display: flex;
              align-items: center;
            }
          }

          &__amount {
            grid-area: amount;
            justify-self: end;
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

@media (min-width: 577px) {
  .bills {
    .content {
      .all {
        flex-direction: row;
        .total {
          flex: 1;
          flex-direction: column;
          align-items: start;
        }
        .summary {
          flex: 1;
        }
      }

      .details {
        .session {
          &-title {
            display: grid;
            grid-template-columns: 32px 2.5fr 1fr 1fr;
            gap: var(--spacing-16);
            @include text.text-styles('text-preset-5');
            color: var(--color-grey-500);
            padding: var(--spacing-12) 0;
            border-bottom: 1px solid var(--color-grey-100);

            &__bill {
              margin-left: -48px;
            }

            &__due {
              justify-self: start;
            }
            &__amount {
              justify-self: end;
            }
          }

          .item {
            grid-template-columns: 32px 2.5fr 1fr 1fr;
            grid-template-areas: 'icon name due amount';

            &__due {
              justify-self: start;
            }
            &__amount {
              justify-self: end;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 1025px) {
  .bills {
    .content {
      grid-template-columns: 1fr 2fr;
      .all {
        flex-direction: column;
        .total {
          flex: unset;
        }
        .summary {
          flex: unset;
        }
      }
    }
  }
}
</style>
