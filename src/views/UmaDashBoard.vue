<script setup lang="ts">
import UmaDashboard from "@/components/UmaDashboard.vue"
import { ArrowLeft } from "lucide-vue-next"
</script>

<template>
  <div class="relative min-h-screen w-full overflow-x-hidden bg-[#F2F4F8] text-slate-700 font-sans selection:bg-uma-turf/30">
    
    <!-- 🟢 装饰背景 -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-40" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <!-- 🧭 顶部导航栏 -->
    <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b-4 border-uma-turf shadow-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <router-link 
          to="/"
          class="flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-uma-turf group"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 group-hover:bg-uma-turf group-hover:text-white transition-colors">
            <ArrowLeft class="h-4 w-4" />
          </div>
          <span class="font-black uppercase tracking-wide">Back to Home</span>
        </router-link>
        
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-uma-turf shadow-md rotate-3 text-white">
            <span class="text-lg font-black">D</span>
          </div>
          <span class="hidden text-lg font-black tracking-tight sm:inline-block text-slate-700">
            DASHBOARD
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
