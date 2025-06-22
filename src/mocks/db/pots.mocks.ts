import { COLOR_OPTIONS } from '@/constants/colors'
import type { Pot } from '@/types/pot'
import { useLocalStorage } from '@vueuse/core'
import { faker } from '@faker-js/faker'

// const originPots = [
//   {
//     name: 'Savings',
//     target: 2000.0,
//     total: 159.0,
//     theme: '#277C78',
//   },
//   {
//     name: 'Concert Ticket',
//     target: 150.0,
//     total: 110.0,
//     theme: '#626070',
//   },
//   {
//     name: 'Gift',
//     target: 150.0,
//     total: 110.0,
//     theme: '#82C9D7',
//   },
//   {
//     name: 'New Laptop',
//     target: 1000.0,
//     total: 10.0,
//     theme: '#F2CDAC',
//   },
//   {
//     name: 'Holiday',
//     target: 1440.0,
//     total: 531.0,
//     theme: '#826CB0',
//   },
// ]
const pots = useLocalStorage<Pot[]>('pots', [])

const remainingColors = [...COLOR_OPTIONS]

/**
 * 从固定颜色中随机获取一个，并且不重复
 * @returns 随机颜色值
 */
const getRandomColor = () => {
  const randomColorIndex = Math.floor(Math.random() * remainingColors.length)
  return remainingColors.splice(randomColorIndex, 1)[0].value
}

const generatePot = (): Pot => {
  return {
    id: faker.string.uuid(),
    name: faker.finance.accountName(),
    target: faker.number.int({ min: 900, max: 10000 }),
    total: faker.number.int(900),
    theme: getRandomColor(),
  }
}

export const getPots = (): Pot[] => {
  if (!pots.value || pots.value.length === 0) {
    pots.value = Array.from({ length: 3 }, () => {
      return generatePot()
    })
  }
  return pots.value
}

export const addPot = (pot: Pot) => {
  pot.id = faker.string.uuid()
  pots.value.push(pot)
}

export const updatePot = (pot: Pot) => {
  pots.value = pots.value.map((item) => {
    if (item.id === pot.id) {
      return {
        ...item,
        ...pot,
      }
    }
    return item
  })
}

export const deletePotById = (id: string) => {
  pots.value = pots.value.filter((item) => item.id !== id)
}

export const upsertPotMoney = (id: string, total: number) => {
  pots.value = pots.value.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        total: total,
      }
    }
    return item
  })
}
