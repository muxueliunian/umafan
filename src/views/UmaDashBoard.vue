<script setup lang="ts">
import UmaDashboard from "@/components/UmaDashboard.vue"
import Particles from "@/components/Particles.vue"
import { ArrowLeft } from "lucide-vue-next"
</script>

<template>
  <div class="relative min-h-screen w-full overflow-x-hidden bg-[#020617] text-slate-100 font-sans selection:bg-primary/30">
    
    <!-- 🌌 背景组件区域 -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <Particles
        :particle-count="300"
        :particle-spread="10"
        :speed="0.1"
        :particle-colors="['#ffffff', '#60a5fa', '#c084fc']"
        :move-particles-on-hover="false"
        :particle-hover-factor="1"
        :alpha-particles="true"
        :particle-base-size="100"
        :size-randomness="1"
        :camera-distance="20"
        :disable-rotation="false"
        class-name="w-full h-full opacity-40"
      />
      <!-- 氛围光晕 -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
    </div>

    <!-- 🧭 顶部导航栏 -->
    <header class="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <router-link 
          to="/"
          class="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Back to Home</span>
        </router-link>
        
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <span class="text-lg font-bold text-white">D</span>
          </div>
          <span class="hidden text-lg font-bold tracking-tight sm:inline-block bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </div>
      </div>
    </header>

    <!-- 📦 主要内容区 -->
    <main class="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <UmaDashboard />
    </main>

  </div>
</template>
