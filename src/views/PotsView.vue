<script setup lang="ts">
import { computed } from 'vue'

const progressPercentage = computed(() => 50)
</script>
<template>
  <div class="pots common-layout-page">
    <div class="head">
      <header class="header">Pots</header>
      <button class="add">+Add New Pot</button>
    </div>
    <div class="details">
      <div class="item">
        <div class="header">
          <div class="header__title">
            <div class="header__title-circle"></div>
            <div class="header__title-name">Savings</div>
          </div>
          <div class="header__more">
            <img src="@/assets/images/icon-ellipsis.svg" alt="ellipsis" />
          </div>
        </div>
        <div class="total">
          <div class="total__saved">
            <div class="total__saved-label">Total Saved</div>
            <div class="total__saved-value">$159.00</div>
          </div>
          <div class="progress">
            <div class="progress__fill" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
          <div class="target">
            <div class="target__percentage">7.95%</div>
            <div class="target__total">Target of $2.000</div>
          </div>
        </div>
        <div class="button">
          <button>+Add Money</button>
          <button>Withdraw</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pots {
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

  .details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-24);

    .item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-32);
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

      .total {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-16);

        &__saved {
          display: flex;
          justify-content: space-between;
          align-items: center;

          &-label {
            @include text.text-styles('text-preset-4');
            color: var(--color-grey-500);
          }
          &-value {
            @include text.text-styles('text-preset-1');
            color: var(--color-grey-900);
          }
        }

        .progress {
          height: 8px;
          border-radius: var(--spacing-4);
          background-color: var(--color-beige-100);

          &__fill {
            height: 100%;
            border-radius: var(--spacing-4);
            background-color: var(--color-green);
          }
        }

        .target {
          display: flex;
          justify-content: space-between;
          color: var(--color-grey-500);

          &__percentage {
            @include text.text-styles('text-preset-5-bold');
          }

          &__total {
            @include text.text-styles('text-preset-5');
          }
        }
      }

      .button {
        display: flex;
        gap: var(--spacing-16);

        button {
          flex: 1;
          padding: var(--spacing-16);
          border-radius: var(--spacing-8);
          background-color: var(--color-beige-100);
          border: 1px solid var(--color-grey-200);
        }
      }
    }
  }
}
</style>
