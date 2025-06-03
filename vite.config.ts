import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/personal-finance-app/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/text-styles" as text;`,
      },
    },
  },
  // 构建时排除Mock代码
  // build: {
  //   rollupOptions: {
  //     external: ['msw'],
  //   },
  // },
})
