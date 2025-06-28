<script setup lang="ts">
import { layoutViewRoutes } from '@/router'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = ref(route.name) // 当前选中的菜单
const handleMenuClick = (menu: string) => {
  activeMenu.value = menu
}

watch(route, (newRoute) => {
  activeMenu.value = newRoute.name
})
</script>
<template>
  <div class="layout">
    <nav class="nav">
      <div class="logo"><img src="@/assets/images/logo-large.svg" alt="logo" /></div>
      <div
        v-for="route in layoutViewRoutes.children"
        :key="route.name"
        class="menu"
        :class="{ 'menu--active': activeMenu === route.name }"
        @click="handleMenuClick(route.name)"
      >
        <router-link
          :to="route.path"
          class="menu__icon"
          :class="{ 'menu__icon--active': activeMenu === route.name }"
        >
          <svg
            fill="currentColor"
            stroke="currentColor"
            height="20"
            viewBox="0 0 20 20"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="route.meta.icon" />
          </svg>

          <div class="menu__icon-name">
            {{ route.name }}
          </div>
        </router-link>
      </div>
    </nav>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  --nav-height: 52px;

  display: flex;
  gap: var(--spacing-40);
  min-height: 100vh;
  flex-direction: column;
  width: 100vw;
  background-color: var(--color-beige-100);

  .nav {
    display: flex;
    background-color: var(--color-grey-900);
    height: var(--nav-height);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: var(--spacing-8) var(--spacing-16) 0 var(--spacing-16);
    border-top-left-radius: var(--spacing-8);
    border-top-right-radius: var(--spacing-8);
    z-index: 900;
    justify-content: center;

    .logo {
      display: none;
    }

    .menu {
      height: calc(var(--nav-height) - var(--spacing-8));
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      &--active {
        background-color: var(--color-beige-100);
        border-top-left-radius: var(--spacing-8);
        border-top-right-radius: var(--spacing-8);
        border-bottom: var(--spacing-4) solid var(--color-green);
      }

      &__icon {
        text-decoration: none;
        display: flex;
        justify-content: center;
        width: 100%;
        align-items: center;
        cursor: pointer;
        color: var(--color-grey-300);

        svg {
          width: 20px;
          height: 20px;
          fill: currentColor; /* 使用 currentColor 来让 SVG 使用父元素的颜色 */
          stroke: currentColor; /* 使用 currentColor 来设置边框颜色 */
        }

        &--active {
          color: var(--color-green);
        }

        &-name {
          display: none;
        }
      }
    }
  }

  .main {
    // background-color: var(--color-beige-100);
    min-height: 100vh;
    padding: var(--spacing-24) var(--spacing-16) var(--nav-height) var(--spacing-16);
  }
}

@media (min-width: 577px) {
  .layout {
    --nav-height: 86px;

    .nav {
      .menu {
        height: 78px;
        &__icon {
          flex-direction: column;
          gap: var(--spacing-4);
          &-name {
            display: block;
          }
        }
      }
    }
    .main {
      padding: var(--spacing-32) 40px var(--nav-height) 40px;
    }
  }
}

@media (min-width: 1025px) {
  .layout {
    flex-direction: row;

    .nav {
      width: 300px;
      height: 100%;
      position: static;
      flex-direction: column;
      border-radius: unset;
      border-top-right-radius: var(--spacing-8);
      border-bottom-right-radius: var(--spacing-8);
      padding: unset;
      padding-right: var(--spacing-24);
      justify-content: start;

      .logo {
        display: block;
        padding: var(--spacing-32);
        gap: var(--spacing-24);
      }

      .menu {
        width: 100%;
        height: auto;
        flex: none;
        padding: var(--spacing-16) var(--spacing-32);
        justify-content: start;
        &--active {
          border-radius: unset;
          border-bottom: unset;
          border-top-right-radius: var(--spacing-8);
          border-bottom-right-radius: var(--spacing-8);
          border-left: var(--spacing-4) solid var(--color-green);
        }
        &__icon {
          width: auto;
          flex-direction: row;
          gap: var(--spacing-16);

          &-name {
            display: block;
          }
        }
      }
    }
    .main {
      flex: 1;
      padding: var(--spacing-32) 0;
    }
  }
}
</style>
