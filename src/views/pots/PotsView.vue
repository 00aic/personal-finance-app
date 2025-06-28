<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import UpsertPot from './UpsertPot.vue'
import { getPots, deletePotById, updatePot, addPot, upsertPotMoney } from '@/api/modules/pots'
import DropdownButton from '@/components/dropdown-button'
import ConfirmationDialog from '@/components/confirmation-dialog'
import UpsertMoney from './UpsertMoney.vue'
import type { Pot } from '@/types/pot'
import AmountChart from './AmountChart.vue'

const pots = ref<Pot[]>([])
const getPotsData = async () => {
  pots.value = (await getPots()).data
}
onMounted(async () => {
  await getPotsData()
})

const potsWithProgress = computed(() => {
  return pots.value.map((item) => {
    return {
      ...item,
      progressPercentage: Math.min(((item.total ?? 0) / item.target) * 100, 100),
    }
  })
})

const showAddDialog = ref<boolean>(false)
const handleShowAddDialog = () => {
  showAddDialog.value = true
}
const handlePotAdd = async (pot: Pot) => {
  await addPot(pot)
  await getPotsData()
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
const currentItem = ref<Pot>({
  id: '',
  name: '',
  target: 0,
  theme: '',
})
const handleActions = (selected: string, item: Pot) => {
  currentItem.value = item
  // 删除操作
  if ('delete' === selected) {
    showDeleteDialog.value = true
  } else {
    // 编辑操作
    showEditDialog.value = true
  }
}
const handlePotDelete = async (id: string) => {
  await deletePotById(id)
  await getPotsData()
}

const handlePotUpdate = async (pot: Pot) => {
  await updatePot(pot)
  await getPotsData()
}

const showMoneyDialog = ref<boolean>(false)
const currentMode = ref<'add' | 'withdraw'>('add')
const handleMoneyAdd = (item: Pot) => {
  currentItem.value = item
  currentMode.value = 'add'
  showMoneyDialog.value = true
}
const handleMoneyWithdraw = (item: Pot) => {
  currentItem.value = item
  currentMode.value = 'withdraw'
  showMoneyDialog.value = true
}
const handlePotUpsert = async (total: number) => {
  await upsertPotMoney(currentItem.value.id, total)
  await getPotsData()
}
</script>
<template>
  <div class="pots common-layout-page">
    <div class="head">
      <header class="header">Pots</header>
      <button class="add" @click="handleShowAddDialog">+Add New Pot</button>
    </div>
    <UpsertPot v-model="showAddDialog" @upset="handlePotAdd" />
    <div class="details">
      <div
        class="item"
        v-for="(item, index) in potsWithProgress"
        :key="index"
        :style="{ '--color-budget-border': item.theme }"
      >
        <div class="header">
          <div class="header__title">
            <div class="header__title-circle"></div>
            <div class="header__title-name">{{ item.name }}</div>
          </div>
          <DropdownButton
            :options="actionOptions"
            @select="(selected) => handleActions(selected, item)"
          />
        </div>
        <AmountChart type="static" :data="item" />
        <div class="button">
          <button @click="handleMoneyAdd(item)">+Add Money</button>
          <button @click="handleMoneyWithdraw(item)">Withdraw</button>
        </div>
      </div>

      <ConfirmationDialog
        v-model="showDeleteDialog"
        :title="`Delete '${currentItem.name}'?`"
        message="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
        confirm-text="Yes, Confirm Deletion"
        cancel-text="No, Go Back"
        @confirm="handlePotDelete(currentItem.id)"
      />
      <UpsertPot :data="currentItem" v-model="showEditDialog" @upset="handlePotUpdate" />
      <UpsertMoney
        v-model="showMoneyDialog"
        :mode="currentMode"
        :data="currentItem"
        @upset="handlePotUpsert"
      />
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
    display: grid;
    grid-template-columns: 1fr;
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
            background-color: var(--color-budget-border);
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

@media (min-width: 1025px) {
  .pots {
    .details {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
