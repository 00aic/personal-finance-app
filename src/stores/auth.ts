import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = useLocalStorage('isLoggedIn', false)
  const credentialUser = ref<string>()

  const login = (credentials: string) => {
    isLoggedIn.value = true
    credentialUser.value = credentials
  }

  const logout = () => {
    isLoggedIn.value = false
    credentialUser.value = undefined
  }

  return { isLoggedIn, login, logout }
})
