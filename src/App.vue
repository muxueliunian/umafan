<script setup lang="ts">
import { computed } from "vue"
import { useColorMode } from "@vueuse/core"
import { SunIcon, MoonIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import UmaDashboard from "@/components/UmaDashboard.vue"

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.value = isDark.value ? "light" : "dark"
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">UmaFan</p>
          <h1 class="mt-1 text-2xl font-bold sm:text-3xl">UMACLUBFANSDATA</h1>
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
</template>
