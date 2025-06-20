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
        </router-link>
      </div>
    </nav>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
<style lang="scss" scoped>
$nav-height: 52px;
.layout {
  display: flex;
  gap: var(--spacing-40);
  min-height: 100vh;
  flex-direction: column;
  width: 100vw;

  .nav {
    display: flex;
    background-color: var(--color-grey-900);
    height: $nav-height;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: var(--spacing-8) var(--spacing-16) 0 var(--spacing-16);
    border-top-left-radius: var(--spacing-8);
    border-top-right-radius: var(--spacing-8);
    z-index: 900;

    .menu {
      height: 44px;
      width: 68.6px;
      display: flex;
      justify-content: center;

      &--active {
        background-color: var(--color-beige-100);
        border-top-left-radius: var(--spacing-8);
        border-top-right-radius: var(--spacing-8);
        border-bottom: var(--spacing-4) solid var(--color-green);
      }

      &__icon {
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
      }
    }
  }

  .main {
    background-color: var(--color-beige-100);
    min-height: 100vh;
    padding-bottom: $nav-height;
  }
}
</style>
