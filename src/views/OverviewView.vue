<script setup lang="ts">
import { computed } from 'vue'
import BudgetsDoughnut from '@/components/BudgetsDoughnut'

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
</script>
<template>
  <div class="overview">
    <header class="header">Overview</header>

    <div class="total">
      <div class="total__balance">
        <div class="total__balance-label">Current Balance</div>
        <div class="total__balance-value">$4836</div>
      </div>
      <div class="total__income">
        <div class="total__income-label">Income</div>
        <div class="total__income-value">$5555</div>
      </div>
      <div class="total__expenses">
        <div class="total__expenses-label">Expenses</div>
        <div class="total__expenses-value">$5555</div>
      </div>
    </div>

    <div class="pots">
      <div class="session-header">
        <div class="session-header__title">Pots</div>
        <div class="session-header__action">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="total">
        <div class="total__icon"><img src="@/assets/images/icon-pot.svg" alt="pot" /></div>
        <div class="total__content">
          <div class="total__content-label">Total Saved</div>
          <div class="total__content-value">$850</div>
        </div>
      </div>
      <div class="grid-details">
        <div class="grid-details__item">
          <div class="grid-details__item-label">Savings</div>
          <div class="grid-details__item-value">$159</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Savings</div>
          <div class="grid-details__item-value">$159</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Savings</div>
          <div class="grid-details__item-value">$159</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Savings</div>
          <div class="grid-details__item-value">$159</div>
        </div>
      </div>
    </div>

    <div class="transactions">
      <div class="session-header">
        <div class="session-header__title">Tranctions</div>
        <div class="session-header__action">
          <div>View All</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="details">
        <div class="item">
          <div class="item__user">
            <div class="item__user-avatar">
              <img src="@/assets/images/avatars/emma-richardson.jpg" alt="avatars" />
            </div>
            <div class="item__user-name">Emma Richardson</div>
          </div>
          <div class="item__content">
            <div class="item__content-value">+%75.50</div>
            <div class="item__content-time">19 Aug 2024</div>
          </div>
        </div>
      </div>
    </div>

    <div class="budgets">
      <div class="session-header">
        <div class="session-header__title">Budgets</div>
        <div class="session-header__action">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <BudgetsDoughnut :data="chartData" />
      <div class="grid-details">
        <div class="grid-details__item">
          <div class="grid-details__item-label">Entertainment</div>
          <div class="grid-details__item-value">$50.00</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Bills</div>
          <div class="grid-details__item-value">$50.00</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Dining Out</div>
          <div class="grid-details__item-value">$50.00</div>
        </div>
        <div class="grid-details__item">
          <div class="grid-details__item-label">Personal Care</div>
          <div class="grid-details__item-value">$50.00</div>
        </div>
      </div>
    </div>

    <div class="recurring-bills">
      <div class="session-header">
        <div class="session-header__title">Recurring Bills</div>
        <div class="session-header__action">
          <div>See Details</div>
          <div><img src="@/assets/images/icon-caret-right.svg" alt="caret-right" /></div>
        </div>
      </div>
      <div class="details">
        <div class="details__item">
          <div class="details__item-label">Paid Bills</div>
          <div class="details__item-value">$190.00</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-300) var(--spacing-200);
  gap: var(--spacing-400);

  .header {
    @include text.text-styles('text-preset-1');
    color: var(--grey-900);
  }

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
      gap: var(--spacing-150);
    }
  }

  .grid-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-200);

    &__item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-50);
      position: relative;
      padding-left: var(--spacing-200);

      &::before {
        content: '';
        width: 4px;
        background-color: var(--color-green);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: var(--spacing-100);
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
    gap: var(--spacing-150);

    &__balance,
    &__income,
    &__expenses {
      display: flex;
      flex-direction: column;
      border-radius: var(--spacing-150);
      box-shadow: 0 var(--spacing-100) var(--spacing-300) 0 var(--color-shadow-1);
      padding: var(--spacing-250);
      gap: var(--spacing-150);

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
    padding: var(--spacing-300) var(--spacing-250);
    border-radius: var(--spacing-150);
    box-shadow: 0 var(--spacing-100) var(--spacing-300) 0 var(--color-shadow-1);
    display: flex;
    flex-direction: column;
  }

  .pots {
    gap: var(--spacing-250);

    .total {
      display: flex;
      flex-direction: row;
      padding: var(--spacing-200);
      gap: var(--spacing-200);
      background-color: var(--color-beige-100);
      border-radius: var(--spacing-150);
      box-shadow: 0 var(--spacing-100) var(--spacing-300) 0 var(--color-shadow-1);

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
    gap: var(--spacing-400);

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-250);

      .item {
        display: flex;
        justify-content: space-between;

        &__user {
          display: flex;
          gap: var(--spacing-200);

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
    gap: var(--spacing-400);

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-150);
      background-color: var(--color-beige-100);

      &__item {
        display: flex;
        justify-content: space-between;
        border-radius: var(--spacing-100);
        border-left: 4px solid var(--color-green);
        padding: var(--spacing-250) var(--spacing-200);
        &-label {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
        }
        &-value {
          @include text.text-styles('text-preset-4-bold');
          color: var(--color-grey-900);
        }
      }
    }
  }
}
</style>
