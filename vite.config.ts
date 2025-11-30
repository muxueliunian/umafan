import path from "node:path"
import type { MinifyOptions } from "terser"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const terserOptions: MinifyOptions = {
  compress: {
    drop_console: true,
    drop_debugger: true
  }
}

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router"],
          echarts: ["echarts"],
          element: ["element-plus"],
          ui: ["@vueuse/core", "lucide-vue-next", "reka-ui"]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions
  }
})
