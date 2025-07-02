<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types/user'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login, createAccount } from '@/api/modules/login'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import FormItem from '@/components/form-item'
import MessageBox from '@/components/message-box'
import logger from '@/utils/logger'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref<boolean>(true)
const showMessageBox = ref<boolean>(false)

const form = ref<User>({
  email: '',
  password: '',
})

const title = computed(() => (isLogin.value ? 'Login' : 'Sign Up'))
const passwordLabel = computed(() => (isLogin.value ? 'Password' : 'Create Password'))
const buttonName = computed(() => (isLogin.value ? 'Login' : 'Create Account'))
const footerTip = computed(() =>
  isLogin.value ? 'Need to create an account?' : 'Already have an account?',
)
const footerAction = computed(() => (isLogin.value ? 'Sign Up' : 'Login'))

const requiredMsg = "Can't be empty"
const schema = computed(() =>
  yup.object({
    name: isLogin.value ? yup.string().optional() : yup.string().required(requiredMsg),
    email: yup.string().email().required(requiredMsg),
    password: isLogin.value
      ? yup.string().required(requiredMsg)
      : yup.string().min(8, 'Passwords must be at least 8 characters').required(requiredMsg),
  }),
)
const { handleSubmit } = useForm<User>({
  validationSchema: schema,
})

const handleLoginAndSign = () => {
  if (isLogin.value) {
    handleLogin()
  } else {
    handleSignUp()
  }
}

const handleToLoginAndSign = () => {
  form.value = { name: '', email: '', password: '' }
  if (isLogin.value) {
    // 登录页面，创建用户需要跳转到signup
    handleToSignUp()
  } else {
    handleToLogin()
  }
}
const messageBoxMsg = ref<string>('')
const handleLogin = handleSubmit(async () => {
  try {
    const loginResult = await login(form.value)
    if (loginResult.data.success) {
      authStore.login(loginResult.data.user ?? '')
      router.push({ name: 'Overview' })
    } else {
      messageBoxMsg.value = loginResult.data.message ?? 'Login Failed'
      showMessageBox.value = true
    }
  } catch (error) {
    logger.error(error)
  }
})

const handleSignUp = handleSubmit(async () => {
  try {
    await createAccount(form.value)
    messageBoxMsg.value = 'Create account successfully.'
    showMessageBox.value = true
  } catch (error) {
    logger.error(error)
    messageBoxMsg.value = 'Failed to create account.'
    showMessageBox.value = true
  }
})

const handleToSignUp = () => {
  isLogin.value = false
}

const handleToLogin = () => {
  isLogin.value = true
}
</script>
<template>
  <div class="login">
    <div class="header">
      <picture>
        <div class="header__top">
          <img src="@/assets/images/logo-large.svg" alt="logo" />
        </div>
        <source
          srcset="@/assets/images/illustration-authentication.svg"
          media="(min-width: 1025px)"
        />
        <source srcset="@/assets/images/logo-large.svg" media="(max-width: 768px)" />
        <img src="@/assets/images/logo-large.svg" alt="logo" class="header__img" />
        <div class="header__bottom">
          <div class="header__bottom-title">Keep track of your money and save for your future</div>
          <div class="header-_bottom-desc">
            Personal finance app puts you in control of your spending. Track transactions, set
            budgets, and add to savings pots easily.
          </div>
        </div>
      </picture>
    </div>
    <div class="container-wrapper">
      <div class="container">
        <div class="container__title">{{ title }}</div>
        <form class="container__form">
          <FormItem v-if="!isLogin" v-model="form.name" name="name" label="Name"></FormItem>
          <FormItem v-model="form.email" name="email" label="Email" v-slot="{ field }">
            <input type="email" v-bind="field" name="email" id="email" />
          </FormItem>
          <FormItem
            v-model="form.password"
            name="password"
            :label="passwordLabel"
            v-slot="{ field }"
          >
            <input
              type="password"
              v-bind="field"
              name="password"
              id="password"
              @keyup.enter="handleLoginAndSign"
            />
            <div v-if="!isLogin" class="password-tip">Passwords must be at least 8 characters</div>
          </FormItem>
        </form>
        <button class="container__button" type="submit" @click="handleLoginAndSign">
          {{ buttonName }}
        </button>
        <div class="container__footer">
          <span class="container__footer-tip">{{ footerTip }}</span>
          <span class="container__footer-action" @click="handleToLoginAndSign">{{
            footerAction
          }}</span>
        </div>
      </div>
    </div>
    <MessageBox v-model="showMessageBox" :message="messageBoxMsg" />
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
    align-items: center;

    picture {
      display: flex;
      align-items: center;
    }

    &__top,
    &__bottom {
      display: none;
    }
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
      gap: var(--spacing-32);
      padding: var(--spacing-24) var(--spacing-20);
      border-radius: var(--spacing-12);
      box-shadow: 0 var(--spacing-8) var(--spacing-24) 0 var(--color-shadow-1);

      &__title {
        @include text.text-styles('text-preset-1');
        color: var(--color-grey-900);
      }

      &__form {
        display: flex;
        flex-direction: column;
        // align-items: center;
        gap: var(--spacing-16);
        width: 100%;

        .password-tip {
          justify-self: end;
          @include text.text-styles('text-preset-5');
          color: var(--color-grey-500);
          margin-top: var(--spacing-4);
        }
      }

      &__button {
        width: 100%;
        padding: var(--spacing-16);
        background-color: var(--color-grey-900);
        border-radius: var(--spacing-8);
        border: 1px solid var(--color-grey-200);
        color: var(--color-white);
        @include text.text-styles('text-preset-4-bold');
        cursor: pointer;
      }

      &__footer {
        display: flex;
        justify-content: center;
        gap: var(--spacing-8);

        &-tip {
          @include text.text-styles('text-preset-4');
          color: var(--color-grey-500);
        }

        &-action {
          @include text.text-styles('text-preset-4-bold');
          color: var(--color-grey-900);
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
}
@media (min-width: 577px) {
  .login {
    .container-wrapper {
      .container {
        width: 560px;
      }
    }
  }
}

@media (min-width: 1025px) {
  .login {
    flex-direction: row;
    width: 100vw;

    .header {
      width: 600px;
      height: 100vh;
      background: none;
      padding: var(--spacing-20);
      justify-content: unset;

      picture {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
      }
      &__img {
        width: 100%;
        height: 100%;
        border-radius: var(--spacing-12);
        border: 1px solid #dbe5e6;
        object-fit: cover;
        display: block;
      }

      &__top {
        display: block;
        position: absolute;
        top: 40px;
        left: 40px;
      }

      &__bottom {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding: 40px;
        position: absolute;
        left: 0;
        bottom: 0;
        color: var(--color-white);
        &-title {
          @include text.text-styles('text-preset-1');
        }
        &-desc {
          @include text.text-styles('text-preset-4');
        }
      }
    }
    .container-wrapper {
      justify-content: center;
      .container {
        max-width: 560px;
      }
    }
  }
}
</style>
