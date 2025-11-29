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

    <!-- 🧭 顶部导航栏 (悬浮玻璃态) -->
    <header class="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#020617]/30">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <span class="text-lg font-bold text-white">U</span>
          </div>
          <span class="hidden text-lg font-bold tracking-tight sm:inline-block bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            UmaFan
          </span>
        </div>

        <!-- 搜索栏 (桌面端) -->
        <div class="hidden max-w-md flex-1 items-center justify-center px-8 md:flex">
          <div class="relative w-full group">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-400" />
            <input 
              type="text" 
              placeholder="搜索攻略、角色、标签..." 
              class="h-10 w-full rounded-full border border-white/10 bg-white/5 px-10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-3">
          <!-- 移动端核心功能：粉丝数据查询 (高亮显示) -->
          <button 
            @click="router.push('/dashboard')"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95 lg:hidden"
          >
            <DataAnalysis class="h-4 w-4" />
            <span>查社团粉丝数据</span>
          </button>

          <button class="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:block">
            登录
          </button>
          <button 
            @click="mobileMenuOpen = true"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- 📦 主要内容区 -->
    <main class="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-8 lg:flex-row">
        
        <!-- 左侧：攻略列表 -->
        <div class="flex-1 min-w-0">
          <!-- 标题区 -->
          <div class="mb-8 flex items-end justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">攻略中心</h1>
              <p class="mt-2 text-slate-400">精选赛马娘育成指南与数据分析</p>
            </div>
            <div class="hidden gap-2 sm:flex">
              <button class="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/10 hover:bg-white/20">最新</button>
              <button class="rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5">最热</button>
            </div>
          </div>

          <!-- 卡片网格 -->
          <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <article 
              v-for="(item, index) in guideList" 
              :key="index"
              class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.07] hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
            >
              <!-- 图片占位 -->
              <div class="aspect-video w-full overflow-hidden bg-slate-800/50 relative group-hover:scale-105 transition-transform duration-500">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.title"
                  class="h-full w-full object-cover transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"></div>
                <!-- 模拟图片内容 (无图片时显示) -->
                <div v-if="!item.image" class="absolute inset-0 flex items-center justify-center text-slate-600">
                  <span class="text-4xl opacity-20">🖼️</span>
                </div>
                <!-- 标签 -->
                <div class="absolute top-3 left-3 flex gap-2">
                  <span class="rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md border border-white/10">
                    {{ item.category }}
                  </span>
                </div>
              </div>

              <!-- 内容 -->
              <div class="flex flex-1 flex-col p-5">
                <h3 class="mb-2 text-lg font-semibold leading-snug text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {{ item.title }}
                </h3>
                <div class="mt-auto flex items-center justify-between text-xs text-slate-500">
                  <div class="flex gap-2">
                    <span v-for="tag in item.tags" :key="tag" class="text-slate-400">
                      {{ tag }}
                    </span>
                  </div>
                  <span>{{ item.time }} min read</span>
                </div>
              </div>
            </article>
          </div>

          <!-- 分页 -->
          <div class="mt-12 flex justify-center">
            <nav class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button class="rounded-full px-4 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50">Prev</button>
              <span class="px-4 text-sm font-medium text-blue-400">1</span>
              <button class="rounded-full px-4 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-white">Next</button>
            </nav>
          </div>
        </div>

        <!-- 右侧：侧边栏 (桌面端) -->
        <aside class="hidden w-80 shrink-0 space-y-8 lg:block">
          <SidebarContent />
        </aside>

      </div>
    </main>

    <!-- 📱 移动端抽屉菜单 -->
    <!-- 遮罩 -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" @click="mobileMenuOpen = false"></div>
    </Transition>

    <!-- 抽屉内容 -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-y-0 right-0 z-50 w-80 border-l border-white/10 bg-[#0b1121] p-6 shadow-2xl lg:hidden">
        <div class="mb-8 flex items-center justify-between">
          <span class="text-lg font-bold text-white">Menu</span>
          <button @click="mobileMenuOpen = false" class="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </div>
        <SidebarContent />
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import { Search, Menu, DataAnalysis, ArrowRight } from '@element-plus/icons-vue'
import { Zap, TrendingUp } from 'lucide-vue-next'
import Particles from '@/components/Particles.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenuOpen = ref(false)

// 模拟数据
const guideList = ref([
  { title: '如何成为一名可爱的男娘：从零开始的入门指南', time: 15, category: '新手', tags: ['#入门', '#心态'], image: '/covers/1.jpg' },
  { title: '伪声技巧进阶：如何练出自然的少女音', time: 20, category: '进阶', tags: ['#伪声', '#声音'], image: '/covers/2.jpg' },
  { title: '妆容教程：日常系清透底妆与眼妆画法', time: 12, category: '实用', tags: ['#化妆', '#美妆'], image: '/covers/3.jpg' },
  { title: '服装搭配：挑选适合自己身型的裙装', time: 10, category: '新手', tags: ['#穿搭', '#服饰'], image: '/covers/4.jpg' },
  { title: '体态管理：如何举手投足更有少女感', time: 18, category: '进阶', tags: ['#体态', '#气质'], image: '/covers/5.jpg' },
  { title: '假发护理与佩戴：让假发看起来像真发', time: 8, category: '工具', tags: ['#假发', '#护理'], image: '/covers/6.jpg' },
  { title: '男娘的自我修养：心理建设与自信培养', time: 25, category: '理论', tags: ['#心理', '#自信'], image: '/covers/7.jpg' },
  { title: '漫展游场指南：注意事项与社交礼仪', time: 10, category: '实用', tags: ['#漫展', '#社交'], image: '/covers/8.jpg' },
  { title: '好物推荐：那些相见恨晚的变美神器', time: 5, category: '资料', tags: ['#种草', '#好物'], image: '/covers/9.jpg' },
])

// --- 侧边栏内容组件 ---
const SidebarContent = defineComponent({
  setup() {
    return () => h('div', { class: 'space-y-6' }, [
      
      // 1. 常用工具 (高亮)
      h('div', { class: 'rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5' }, [
        h('h3', { class: 'mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-400' }, [
          h(Zap, { class: 'h-4 w-4' }),
          'Tools'
        ]),
        h('div', { class: 'space-y-3' }, [
          // 粉丝数据入口
          h('button', { 
            class: 'group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-left shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30',
            onClick: () => router.push('/dashboard')
          }, [
            h('div', { class: 'flex items-center gap-3' }, [
              h('div', { class: 'flex h-8 w-8 items-center justify-center rounded-lg bg-white/20' }, 
                h(DataAnalysis, { class: 'h-5 w-5 text-white' })
              ),
              h('div', [
                h('div', { class: 'text-sm font-bold text-white' }, '粉丝数据查询'),
                h('div', { class: 'text-[10px] text-blue-100/80' }, '实时追踪社团粉丝数据')
              ])
            ]),
            h(ArrowRight, { class: 'h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1' })
          ]),
          
          // 其他工具占位
          h('button', { class: 'flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white' }, [
            h('div', { class: 'h-2 w-2 rounded-full bg-emerald-400' }),
            '因子计算器 (Coming Soon)'
          ])
        ])
      ]),

      // 2. 筛选/标签
      h('div', { class: 'rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm' }, [
        h('h3', { class: 'mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500' }, 'Filters'),
        h('div', { class: 'flex flex-wrap gap-2' }, 
          ['全部', '新手', '进阶', '理论', '数据', '活动'].map(tag => 
            h('button', { class: 'rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white' }, tag)
          )
        )
      ]),

      // 3. 本周活动
      h('div', { class: 'rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm' }, [
        h('h3', { class: 'mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500' }, [
          h(TrendingUp, { class: 'h-4 w-4' }),
          'Trending'
        ]),
        h('div', { class: 'space-y-4' }, [
          h('div', { class: 'flex gap-3' }, [
            h('div', { class: 'h-12 w-12 shrink-0 rounded-lg bg-slate-800' }), // 占位图
            h('div', [
              h('h4', { class: 'text-sm font-medium text-slate-200 line-clamp-2' }, '新剧本"Onsen"速报：剧本机制详解'),
              h('span', { class: 'text-xs text-slate-500' }, '2 hours ago')
            ])
          ]),
          h('div', { class: 'flex gap-3' }, [
            h('div', { class: 'h-12 w-12 shrink-0 rounded-lg bg-slate-800' }), 
            h('div', [
              h('h4', { class: 'text-sm font-medium text-slate-200 line-clamp-2' }, 'Onsen杯唉唉真的要复活了吗？ <-快来看看他是怎么说的'),
              h('span', { class: 'text-xs text-slate-500' }, '5 hours ago')
            ])
          ])
        ])
      ])

    ])
  }
})
</script>

<style>
/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020617; 
}
::-webkit-scrollbar-thumb {
  background: #1e293b; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155; 
}
</style>
