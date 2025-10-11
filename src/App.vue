<script setup lang="ts">
import { computed } from "vue"
import { useColorMode } from "@vueuse/core"
import { SunIcon, MoonIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import UmaDashboard from "@/components/UmaDashboard.vue"
import CircularGugugaga from "@/components/CircularGugugaga.vue"
import Ballpit from "@/components/Ballpit.vue"

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.value = isDark.value ? "light" : "dark"
}
</script>

<template>
  <div class="relative">
    <!-- 全屏背景容器 -->
    <div class="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 to-slate-900">
      <Ballpit
        :count="150"
        :gravity="0.3"
        :colors="[0x0ea5e9, 0x6366f1, 0xa855f7]"
        :ambientIntensity="0.5"
        :lightIntensity="100"
        class-name="opacity-25 mix-blend-screen"
      />
    </div>
    <div class="relative z-10 backdrop-blur-[1px]">
      <header class="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">UmaFan</p>
          <h1 class="mt-1 text-2xl font-bold sm:text-3xl">UMACLUBFANSDATA🐧</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full border border-white/10 bg-background/70 shadow-lg backdrop-blur"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <MoonIcon v-if="colorMode === 'light'" class="h-5 w-5" />
          <SunIcon v-else class="h-5 w-5" />
        </Button>
      </div>
      <CircularGugugaga
          text="🐧🐧gugugaga!🐧🐧🐧🐧🐧🐧🐧🐧"
          :spin-duration="20"
          on-hover="speedUp"
          class-name="text-blue-500"
        />
      </header>
      <main class="mx-auto w-full max-w-6xl px-6 py-10">
        <UmaDashboard />
      </main>
      <footer class="border-t border-white/10 bg-background/70 py-6 text-sm text-muted-foreground">
        <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-center sm:flex-row sm:text-left">
          <span>gugugaga!🐧🐧🐧</span>
          <span>🐧🐧🐧gugugaga!</span>
        </div>
      </footer>
    </div>
  </div>

    
</template>
