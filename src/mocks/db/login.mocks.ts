import type { LoginResult } from '@/types/login'
import type { User } from '@/types/user'
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY = 'login'

const users = useLocalStorage<User[]>(`${STORAGE_KEY}_users`, [])

export const login = (params: User): LoginResult => {
  try {
    if (!params.email || !params.password) {
      return {
        success: false,
        message: 'Email and password cannot be empty',
      }
    }

    const loginUser = users.value.find(
      (item) => item.email === params.email && item.password === params.password,
    )

    if (loginUser) {
      return {
        success: true,
        user: loginUser.email,
        message: 'Login Successfully',
      }
    } else {
      return {
        success: false,
        message: 'Incorrect e-mail or password',
      }
    }
  } catch (error) {
    console.log('登录过程失败', error)
    return {
      success: false,
      message: 'Login failed, please try again later',
    }
  }
}

export const createAccount = (params: User) => {
  users.value.push(params)
}
