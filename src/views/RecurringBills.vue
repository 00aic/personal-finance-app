<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput'
import SelectPicker from '@/components/SelectPicker'

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
          <div class="total__bills-value">$384.98</div>
        </div>
      </div>
      <div class="summary">
        <div class="title">Summary</div>
        <div class="items">
          <div class="item">
            <div class="item__label">Paid Bills</div>
            <div class="item__value">2($320.00)</div>
          </div>
          <div class="item">
            <div class="item__label">Total Upcoming</div>
            <div class="item__value">2($320.00)</div>
          </div>
          <div class="item due">
            <div class="item__label">Due Soon</div>
            <div class="item__value">2($320.00)</div>
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
            :options="sortOptions"
          />
        </div>
        <div class="session">
          <div class="item">
            <div class="title">
              <div class="title__icon">
                <img src="@/assets/images/avatars/spark-electric-solutions.jpg" alt="" />
              </div>
              <div class="title__name">Spark Electric Solutions</div>
            </div>
            <div class="value">
              <div class="due">
                <div class="due__date">Monthly-2nd</div>
                <div><img src="@/assets/images/icon-bill-paid.svg" alt="paid" /></div>
              </div>
              <div class="amount">$100.00</div>
            </div>
          </div>

          <div class="item">
            <div class="title">
              <div class="title__icon">
                <img src="@/assets/images/avatars/spark-electric-solutions.jpg" alt="" />
              </div>
              <div class="title__name">Spark Electric Solutions</div>
            </div>
            <div class="value">
              <div class="due">
                <div class="due__date">Monthly-2nd</div>
                <div><img src="@/assets/images/icon-bill-paid.svg" alt="paid" /></div>
              </div>
              <div class="amount">$100.00</div>
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
            }

            .amount {
              @include text.text-styles('text-preset-4-bold');
              color: var(--color-grey-900);
            }
          }
        }
      }
    }
  }
}
</style>
