import type { Login } from '@/types/login'
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY = 'login'

const loginUsers = useLocalStorage<Login[]>(`${STORAGE_KEY}_users`, [])

export const login = (params: Login) => {
  // const users = [
  //   { email: 'zhangs', password: 'zhangs' },
  //   { email: 'lis', password: 'lis' },
  //   { email: 'wangw', password: 'wangw' },
  // ]

  const credentialUser = loginUsers.value.find(
    (item) => item.email === params.email && item.password === params.password,
  )
  return credentialUser
}

export const createAccount = (params: Login) => {
  loginUsers.value.push(params)
}
