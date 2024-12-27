import { defineNuxtConfig } from 'nuxt/config'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  srcDir: 'src/',
  compatibilityDate: '2024-12-26',
  vite: {
    plugins: [svgLoader()],
    resolve: {
      alias: {
        '@/': './src',
        '@icons': './src/assets/icons/index.ts',
      },
    },
  },
  css: ['@/assets/scss/global.scss'],
})
