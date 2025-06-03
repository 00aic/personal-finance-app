<script setup lang="ts">
import { ref } from 'vue'
import type { Login } from '@/types/login'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login, createAccount } from '@/api/modules/login'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref<Login>({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await login(loginForm.value)
    authStore.login(loginForm.value)
    router.push({ name: 'Overview' })
  } catch (error) {
    console.log(error)
  }
}

const isLogin = ref<boolean>(false)

const handleToSignUp = () => {
  isLogin.value = false
}

const signUpForm = ref<Login>({})

const handleToLogin = () => {
  isLogin.value = true
}

const handleSignUp = async () => {
  await createAccount(signUpForm.value)
}
</script>
<template>
  <div class="login">
    <div class="header"><img src="@/assets/images/logo-large.svg" alt="logo" /></div>
    <div class="container-wrapper">
      <div class="container" v-if="isLogin">
        <div class="container__title">Login</div>
        <form class="container__form">
          <label for="email">
            Email:
            <input type="text" v-model="loginForm.email" name="email" id="email" />
          </label>
          <label for="password">
            Password:
            <input type="password" v-model="loginForm.password" name="password" id="password" />
          </label>
        </form>
        <button class="container__button" type="submit" @click="handleLogin">Login</button>
        <div class="container__footer">
          <span class="container__footer-tip">Need to create an account?</span>
          <span class="container__footer-sign" @click="handleToSignUp">Sign Up</span>
        </div>
      </div>

      <div class="container" v-if="!isLogin">
        <div class="container__title">Sign Up</div>
        <form class="container__form">
          <label for="name">
            Name:
            <input type="text" v-model="signUpForm.name" name="name" id="name" />
          </label>
          <label for="email">
            Email:
            <input type="email" v-model="signUpForm.email" name="email" id="email" />
          </label>
          <label for="password">
            Create Password:
            <input type="password" v-model="signUpForm.password" name="password" id="password" />
            <div class="password-tip">Passwords must be at least 8 characters</div>
          </label>
        </form>
        <button class="container__button" type="submit" @click="handleSignUp">
          Create Account
        </button>
        <div class="container__footer">
          <span class="container__footer-tip">Already have an account?</span>
          <span class="container__footer-sign" @click="handleToLogin">Login</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  background-color: var(--color-beige-100);
  align-items: center;
  min-height: 100vh;

  .header {
    width: 100vw;
    height: 69.76px;
    background-color: var(--color-grey-900);
    display: flex;
    justify-content: center;
  }

  .container-wrapper {
    flex: 1;
    display: flex;
    // justify-self: center;
    align-items: center;

    .container {
      // justify-self: center;
      display: flex;
      flex-direction: column;
      background-color: var(--color-white);
      width: 343px;
      // align-items: center;
      gap: var(--spacing-400);
      padding: var(--spacing-300) var(--spacing-250);
      border-radius: 12px;
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);

      &__title {
        @include text.text-styles('text-preset-1');
        color: var(--color-grey-900);
      }

      &__form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-200);
        width: 100%;

        label {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-50);
          @include text.text-styles('text-preset-5-bold');
          color: var(--color-grey-500);

          input {
            height: 45px;
            padding: var(--spacing-150) var(--spacing-250);
            border: 1px solid var(--color-beige-500);
            border-radius: 8px;
          }

          .password-tip {
            align-self: end;
            @include text.text-styles('text-preset-5');
          }
        }
      }

      &__button {
        width: 100%;
        padding: 16px;
        background-color: var(--color-grey-900);
        border-radius: 8px;
        border: 1px solid var(--color-grey-200);
        color: var(--color-white);
        @include text.text-styles('text-preset-4-bold');
      }

      &__footer {
        display: flex;
        justify-content: center;
        gap: var(--spacing-100);

        &-tip {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
        }

        &-sign {
          @include text.text-styles('text-preset-4-bold');
          color: var(--color-grey-900);
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
