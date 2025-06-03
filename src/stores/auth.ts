import type { Login } from '@/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const credentialUser = ref<Login>()

  const login = (credentials: Login) => {
    isLoggedIn.value = true
    credentialUser.value = credentials
  }

  const logout = () => {
    isLoggedIn.value = false
    credentialUser.value = undefined
  }

  return { isLoggedIn, login, logout }
})
