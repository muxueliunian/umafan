import path from "node:path"
import type { MinifyOptions } from "terser"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"

const terserOptions: MinifyOptions = {
  compress: {
    drop_console: true,
    drop_debugger: true
  }
}

export default defineConfig({
  base: "./",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          echarts: ["echarts"],
          ui: ["@vueuse/core", "lucide-vue-next", "reka-ui"]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions
  }
})
