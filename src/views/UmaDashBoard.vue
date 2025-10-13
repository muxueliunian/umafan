<script setup lang="ts">
import { computed } from "vue"
import { useColorMode } from "@vueuse/core"
import { SunIcon, MoonIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import UmaDashboard from "@/components/UmaDashiboard.vue"
import CircularGugugaga from "@/components/CircularGugugaga.vue"
import Particles from "@/components/Particles.vue"
// import Ballpit from "@/components/Ballpit.vue" // 暂时注释

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.value = isDark.value ? "light" : "dark"
}
</script>

<template>
  <div class="relative">
    <!-- 🎨 背景组件区域 - Particles 白色极简风格 -->
    <div class="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 to-slate-900">
      <Particles
        :particle-count="500"
        :particle-spread="10"
        :speed="0.15"
        :particle-colors="['#ffffff', '#f0f0f0', '#e0e0e0']"
        :move-particles-on-hover="false"
        :particle-hover-factor="1"
        :alpha-particles="true"
        :particle-base-size="90"
        :size-randomness="1"
        :camera-distance="20"
        :disable-rotation="false"
        class-name="w-full h-full opacity-100"
      />
    </div>
    <div class="relative z-10">
      <header class="sticky top-0 z-40 border-b border-white/10 bg-background/95">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">UmaFan</p>
          <h1 class="mt-1 text-2xl font-bold sm:text-3xl">UMACLUBFANSDATA🐧</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full border border-white/10 bg-background/90 shadow-lg"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <MoonIcon v-if="colorMode === 'light'" class="h-5 w-5" />
          <SunIcon v-else class="h-5 w-5" />
        </Button>
      </div>
      <router-link 
          to="/"
          class="rounded-[999px] bg-white px-10 py-4 text-base font-semibold text-slate-900 shadow-[0_10px_35px_rgba(255,255,255,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(255,255,255,0.2)]"  
        >Back to HOME</router-link>
      </header>
      <main class="mx-auto w-full max-w-6xl px-6 py-10">
        <UmaDashboard />
      </main>
      <footer class="border-t border-white/10 bg-background/95 py-6 text-sm text-muted-foreground">
        <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-center sm:flex-row sm:text-left">
          <span>gugugaga!🐧🐧🐧</span>
          <span>🐧🐧🐧gugugaga!</span>
        </div>
        <CircularGugugaga
          text="🐧🐧gugugaga!🐧🐧🐧🐧🐧🐧🐧🐧"
          :spin-duration="20"
          on-hover="speedUp"
          class-name="text-blue-500"
        />
      </footer>
    </div>
  </div>

    
</template>
