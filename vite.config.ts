import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['V_'],
  preview: {
    host: true,
  },
  plugins: [
    vue(),
    UnoCSS(),
    viteCompression({
      threshold: 1024000, // 对大于 1mb 的文件进行压缩
    }),
  ],
})
