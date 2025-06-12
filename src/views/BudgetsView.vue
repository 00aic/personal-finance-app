<script setup lang="ts">
import BudgetsDoughnut from '@/components/BudgetsDoughnut'
import { computed } from 'vue'
const colors = {
  entertainment: '#F4A58A',
  bills: '#4ECDC4',
  dining: '#FFD93D',
  personal: '#6B73FF',
}

const chartData = computed(() => ({
  labels: ['Entertainment', 'Bills', 'Dining Out', 'Personal Care'],
  datasets: [
    {
      data: [50.0, 750.0, 75.0, 100.0],
      backgroundColor: [colors.entertainment, colors.bills, colors.dining, colors.personal],
      hoverBackgroundColor: [
        colors.entertainment + 'CC',
        colors.bills + 'CC',
        colors.dining + 'CC',
        colors.personal + 'CC',
      ],
      borderWidth: 0,
      cutout: '70%',
      hoverOffset: 4,
    },
  ],
}))
const maximum = 50
const spent = 25
const progressPercentage = computed(() => Math.min((spent / maximum) * 100, 100))
</script>
<template>
  <div class="budgets common-layout-page">
    <div class="head">
      <header class="header">Budgets</header>
      <button class="add">+Add New Budget</button>
    </div>

    <div class="summary">
      <BudgetsDoughnut :data="chartData" />
      <div class="spending">
        <div class="header">Spending Summary</div>
        <div class="details">
          <div class="item">
            <div class="item__label">Bills</div>
            <div class="item__value">
              <span class="item__value-spent">$150.00</span>
              <span class="item__value-total">of $750.00</span>
            </div>
          </div>

          <div class="item">
            <div class="item__label">Bills</div>
            <div class="item__value">
              <span class="item__value-spent">$150.00</span>
              <span class="item__value-total">of $750.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="details">
      <div class="header">
        <div class="header__title">
          <div class="header__title-circle"></div>
          <div class="header__title-name">Entertainment</div>
        </div>
        <div class="header__more">
          <img src="@/assets/images/icon-ellipsis.svg" alt="ellipsis" />
        </div>
      </div>

      <div class="amount">
        <div class="maximum">Maximum of ${{ maximum }}</div>
        <div class="progress">
          <div class="progress__fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="detail">
          <div class="detail__spent">
            <div class="detail__spent-label">Spent</div>
            <div class="detail__spent-value">${{ spent }}</div>
          </div>
          <div class="detail__remaining">
            <div class="detail__remaining-label">Remaining</div>
            <div class="detail__remaining-value">$25.00</div>
          </div>
        </div>
      </div>

      <div class="latest">
        <div class="header">
          <div class="header__title">Latest Spending</div>
          <div class="header__action">
            <div>See All</div>
            <div><img src="@/assets/images/icon-caret-right.svg" alt="more" /></div>
          </div>
        </div>
        <div class="items">
          <div class="item">
            <div class="item__user">
              <div class="item__user-avatar">
                <img src="@/assets/images/avatars/james-thompson.jpg" alt="avatar" />
              </div>
              <div class="item__user-name">James Thompson</div>
            </div>
            <div class="item__content">
              <div class="item__content-value">-$5.00</div>
              <div class="item__content-time">11 Aug 2024</div>
            </div>
          </div>

          <div class="item">
            <div class="item__user">
              <div class="item__user-avatar">
                <img src="@/assets/images/avatars/james-thompson.jpg" alt="avatar" />
              </div>
              <div class="item__user-name">James Thompson</div>
            </div>
            <div class="item__content">
              <div class="item__content-value">-$5.00</div>
              <div class="item__content-time">11 Aug 2024</div>
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

          &::before {
            content: '';
            top: 0;
            left: 0;
            bottom: 0;
            border-radius: var(--spacing-8);
            border-left: 4px solid var(--color-cyan);
          }

          border-bottom: 1px solid var(--color-grey-100);
          padding-bottom: var(--spacing-16);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
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
          background-color: var(--color-green);
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
          background-color: var(--color-green);
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
            background-color: var(--color-green);
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
