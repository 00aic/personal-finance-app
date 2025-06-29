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

const isMinimizeMenu = ref<boolean>(false)
const handleMinimizeMenu = () => {
  isMinimizeMenu.value = !isMinimizeMenu.value
}
</script>
<template>
  <div class="layout">
    <nav class="nav" :class="{ 'menu-width--reduced': isMinimizeMenu }">
      <div class="logo">
        <img v-if="!isMinimizeMenu" src="@/assets/images/logo-large.svg" alt="logo" />
        <img v-else src="@/assets/images/logo-small.svg" alt="log" />
      </div>
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
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="route.meta.icon" />
          </svg>

          <div class="menu__icon-name" :class="{ 'menu-name--hide': isMinimizeMenu }">
            {{ route.name }}
          </div>
        </router-link>
      </div>
      <div class="minimize" @click="handleMinimizeMenu">
        <svg
          class="minimize__icon"
          :class="{ 'minimize__icon--rotated': isMinimizeMenu }"
          fill="currentColor"
          stroke="currentColor"
          height="20"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m14.0001 5.26002v8.99998c0 .1989-.079.3897-.2197.5304-.1406.1406-.3314.2196-.5303.2196h-2.25v3.75c.0001.1484-.0438.2936-.1262.417-.0824.1235-.1996.2197-.3367.2765s-.288.0717-.4336.0427c-.14554-.029-.27923-.1005-.38412-.2056l-9.000003-9c-.069733-.0696-.125052-.1523-.162795-.2434-.037743-.09102-.05717-.18862-.05717-.28718s.019427-.19615.05717-.2872.093062-.17377.162795-.24342l9.000003-9.000004c.10489-.105009.23858-.1765346.38412-.2055224.1456-.02898777.2965-.0141343.4336.0426801.1371.0568143.2543.1530353.3367.2764803s.1263.268565.1262.416987v3.749999h2.25c.1989 0 .3897.07902.5303.21967.1407.14065.2197.33142.2197.53033zm2.25-.75c-.1989 0-.3897.07902-.5303.21967-.1407.14065-.2197.33142-.2197.53033v8.99998c0 .1989.079.3897.2197.5304.1406.1406.3314.2196.5303.2196s.3897-.079.5303-.2196c.1407-.1407.2197-.3315.2197-.5304v-8.99998c0-.19891-.079-.38968-.2197-.53033-.1406-.14065-.3314-.21967-.5303-.21967zm3 0c-.1989 0-.3897.07902-.5303.21967-.1407.14065-.2197.33142-.2197.53033v8.99998c0 .1989.079.3897.2197.5304.1406.1406.3314.2196.5303.2196s.3897-.079.5303-.2196c.1407-.1407.2197-.3315.2197-.5304v-8.99998c0-.19891-.079-.38968-.2197-.53033-.1406-.14065-.3314-.21967-.5303-.21967z"
          />
        </svg>
        <div v-show="!isMinimizeMenu">Minimize Menu</div>
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
    transition: all 0.2s ease;

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

    .minimize {
      display: none;
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
      padding-bottom: var(--spacing-24);
      padding-right: var(--spacing-24);
      justify-content: start;

      .logo {
        display: block;
        padding: var(--spacing-32);
        gap: var(--spacing-24);
      }

      .menu {
        height: unset;
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
          width: unset;
          flex-direction: row;
          gap: var(--spacing-16);
          flex-shrink: 0; // 防止图片被压缩

          &-name {
            display: block;
          }
        }
      }

      .minimize {
        display: flex;
        margin-top: auto;
        gap: var(--spacing-16);
        align-items: center;
        padding: var(--spacing-16) var(--spacing-32);
        @include text.text-styles('text-preset-3');
        color: var(--color-grey-300);
        cursor: pointer;
        transition: transform 0.3s ease;

        &__icon {
          flex-shrink: 0; // 防止图片被压缩

          &--rotated {
            transform: rotate(180deg);
          }
        }

        &:hover {
          color: var(--color-grey-100);
        }

        svg {
          width: 20px;
          height: 20px;
          fill: currentColor; /* 使用 currentColor 来让 SVG 使用父元素的颜色 */
          stroke: currentColor; /* 使用 currentColor 来设置边框颜色 */
        }
      }
      .menu-name--hide {
        display: none;
      }
    }

    .menu-width--reduced {
      width: 80px;
    }

    .main {
      flex: 1;
      padding: var(--spacing-32) 0;
    }
  }
}
</style>
