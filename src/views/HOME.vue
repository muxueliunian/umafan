<template>
  <div class="relative min-h-screen w-full overflow-x-hidden bg-[#F2F4F8] text-slate-700 font-sans selection:bg-uma-turf/30">
    
    <!-- 🟢 装饰背景 -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-40" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <!-- 🧭 顶部导航栏 (游戏菜单风格) -->
    <header class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-4 border-uma-turf shadow-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-uma-turf shadow-lg shadow-green-500/20 rotate-3 group-hover:rotate-0 transition-transform">
            <span class="text-xl font-black text-white">U</span>
          </div>
          <span class="text-xl font-black tracking-tighter text-slate-800">
            Uma<span class="text-uma-turf">Fan</span>
          </span>
        </div>

        <!-- 搜索栏 (桌面端) -->
        <div class="hidden max-w-md flex-1 items-center justify-center px-8 md:flex">
          <div class="relative w-full group">
            <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-uma-turf" />
            <input 
              type="text" 
              placeholder="搜索攻略、角色、标签..." 
              class="h-11 w-full rounded-full border-2 border-slate-200 bg-slate-50 px-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-uma-turf focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100 transition-all shadow-inner"
            >
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-3">
          <!-- 移动端核心功能：粉丝数据查询 (高亮显示) -->
          <button 
            @click="router.push('/dashboard')"
            class="uma-btn bg-gradient-to-r from-uma-turf to-green-500 text-white border-green-700 px-4 py-1.5 text-xs lg:hidden shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            <DataAnalysis class="h-4 w-4" />
            <span>查粉丝</span>
          </button>

          <button class="uma-btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 border-b-4 px-6 py-2 text-sm hidden sm:block">
            登录
          </button>
          
          <button 
            @click="mobileMenuOpen = true"
            class="uma-btn flex h-10 w-10 items-center justify-center bg-white border-slate-200 text-slate-600 lg:hidden"
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
          <div class="mb-8 flex items-end justify-between border-b-2 border-slate-200 pb-4">
            <div>
              <h1 class="text-3xl font-black text-slate-800 sm:text-4xl flex items-center gap-2">
                <span class="text-uma-turf">#</span> 攻略中心
              </h1>
              <p class="mt-2 text-sm font-bold text-slate-500">精选赛马娘育成指南与数据分析</p>
            </div>
            <div class="hidden gap-2 sm:flex">
              <button class="uma-btn bg-uma-turf border-green-700 text-white px-4 py-1.5 text-xs">最新</button>
              <button class="uma-btn bg-white border-slate-200 text-slate-500 px-4 py-1.5 text-xs hover:text-uma-turf">最热</button>
            </div>
          </div>

          <!-- 卡片网格 (Support Card 风格) -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <article 
              v-for="(item, index) in guideList" 
              :key="index"
              class="uma-card group relative flex flex-col overflow-hidden h-full"
            >
              <!-- 图片占位 (卡面) -->
              <div class="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative border-b-4 border-uma-turf">
                <div class="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-300">
                   <!-- 占位图标: 马蹄铁 -->
                   <svg class="w-16 h-16 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19,5.5H16.5C16.5,4.1 15.4,3 14,3H10C8.6,3 7.5,4.1 7.5,5.5H5A2.5,2.5 0 0,0 2.5,8V18A2.5,2.5 0 0,0 5,20.5H19A2.5,2.5 0 0,0 21.5,18V8A2.5,2.5 0 0,0 19,5.5M5,18V8H7.5V11.5H9.5V8H14.5V11.5H16.5V8H19V18H5Z" />
                   </svg>
                </div>
                
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.title"
                  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <!-- 类型标签 (左上角) -->
                <div class="absolute top-0 left-0 bg-yellow-400 text-yellow-900 border-b-2 border-r-2 border-white px-3 py-1 text-xs font-black shadow-md rounded-br-lg z-10">
                  {{ item.category }}
                </div>
              </div>

              <!-- 内容 -->
              <div class="flex flex-1 flex-col p-4 bg-white">
                <h3 class="mb-3 text-lg font-bold leading-snug text-slate-800 line-clamp-2 group-hover:text-uma-turf transition-colors">
                  {{ item.title }}
                </h3>
                
                <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                  <div class="flex gap-2 flex-wrap">
                    <span v-for="tag in item.tags" :key="tag" class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {{ tag }}
                    </span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    🕒 {{ item.time }} min
                  </span>
                </div>
              </div>
            </article>
          </div>

          <!-- 分页 -->
          <div class="mt-12 flex justify-center">
            <nav class="flex items-center gap-2 rounded-full bg-white p-2 shadow-sm border border-slate-100">
              <button class="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 disabled:opacity-50">
                <ArrowLeft class="w-4 h-4"/>
              </button>
              <span class="w-8 h-8 flex items-center justify-center rounded-full bg-uma-turf text-white font-bold text-sm shadow-md">1</span>
              <button class="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 font-bold text-sm">2</button>
              <button class="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 font-bold text-sm">3</button>
              <span class="text-slate-300">...</span>
              <button class="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
                <ArrowRight class="w-4 h-4"/>
              </button>
            </nav>
          </div>
        </div>

        <!-- 右侧：侧边栏 (桌面端 / 游戏菜单风格) -->
        <aside class="hidden w-80 shrink-0 space-y-6 lg:block">
          <SidebarContent />
        </aside>

      </div>
    </main>

    <!-- 📱 移动端抽屉菜单 -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden" @click="mobileMenuOpen = false"></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-[#F2F4F8] p-6 shadow-2xl lg:hidden flex flex-col h-full border-l-4 border-uma-turf">
        <div class="mb-8 flex items-center justify-between">
          <span class="text-xl font-black text-slate-800">MENU</span>
          <button @click="mobileMenuOpen = false" class="rounded-full p-2 text-slate-400 hover:bg-black/5">
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
           <SidebarContent />
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import { Search, Menu, DataAnalysis, ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import { Zap, TrendingUp } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenuOpen = ref(false)

// 模拟数据
const guideList = ref([
  { title: '赛马娘育成入门：属性优先级、训练选择与休息节奏', time: 14, category: '新手', tags: ['#育成', '#训练', '#入门'], image: '/covers/1.jpg' },
  { title: '因子系统详解：三星因子怎么刷？继承与配种思路', time: 18, category: '机制', tags: ['#因子', '#继承', '#配种'], image: '/covers/2.jpg' },
  { title: '支援卡选择指南：速/耐/力/根/智配置与借卡要点', time: 16, category: '卡组', tags: ['#支援卡', '#编成', '#借卡'], image: '/covers/3.jpg' },
  { title: '技能搭配与取舍：金技能优先级、白技性价比与联动', time: 12, category: '进阶', tags: ['#技能', '#加速', '#终盘'], image: '/covers/4.jpg' },
  { title: '距离/跑法基础：短距离到长距离、逃先差追怎么选', time: 11, category: '基础', tags: ['#跑法', '#距离', '#适性'], image: '/covers/5.jpg' },
  { title: '赛事规划：关键比赛时间表、目标赛与保G1策略', time: 9, category: '实用', tags: ['#赛事', '#G1', '#规划'], image: '/covers/6.jpg' },
  { title: '关键数值门槛：不同距离常见毕业面板与速度线参考', time: 10, category: '数据', tags: ['#面板', '#阈值', '#配速'], image: '/covers/7.jpg' },
  { title: '对人杯/竞技场思路：环境读盘、阵容模板与克制点', time: 15, category: '对战', tags: ['#对人杯', '#竞技场', '#环境'], image: '/covers/8.jpg' },
  { title: '常见翻车点排查：训练不来人、体力管理、出战失误', time: 7, category: '排错', tags: ['#翻车', '#育成', '#优化'], image: '/covers/9.jpg' },
])

// --- 侧边栏/菜单组件 (复用) ---
const SidebarContent = defineComponent({
  setup() {
    return () => h('div', { class: 'space-y-6' }, [
      
      // 1. 常用工具 (高亮)
      h('div', { class: 'uma-card p-5 border-l-4 border-l-uma-blue' }, [
        h('h3', { class: 'mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-uma-blue' }, [
          h(Zap, { class: 'h-4 w-4 stroke-[3px]' }),
          '快捷入口'
        ]),
        h('div', { class: 'space-y-3' }, [
          // 粉丝数据入口
          h('button', { 
            class: 'group w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-uma-blue to-blue-400 p-4 text-left shadow-lg shadow-blue-500/20 transition-all hover:translate-y-[-2px] hover:shadow-xl',
            onClick: () => router.push('/dashboard')
          }, [
            h('div', { class: 'relative z-10 flex items-center justify-between' }, [
               h('div', { class: 'flex items-center gap-3' }, [
                h('div', { class: 'flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white' }, 
                  h(DataAnalysis, { class: 'h-6 w-6' })
                ),
                h('div', [
                  h('div', { class: 'text-base font-black text-white' }, '粉丝数据查询'),
                  h('div', { class: 'text-xs text-blue-100 font-medium' }, '社团/个人数据追踪')
                ])
              ]),
              h(ArrowRight, { class: 'h-5 w-5 text-white/80' })
            ]),
            // 装饰圆环
            h('div', { class: 'absolute -right-4 -bottom-8 h-24 w-24 rounded-full border-4 border-white/10' })
          ]),
          
          // 其他工具占位
          h('button', { class: 'uma-btn w-full items-center gap-3 bg-white border-slate-200 text-slate-500 flex justify-center py-3 text-sm hover:text-uma-turf' }, [
             '更多功能开发中...'
          ])
        ])
      ]),

      // 2. 筛选/标签
      h('div', { class: 'uma-card p-5' }, [
        h('h3', { class: 'mb-4 text-xs font-black uppercase tracking-wider text-slate-400' }, '热门标签'),
        h('div', { class: 'flex flex-wrap gap-2' }, 
          ['全部', '新手', '进阶', '理论', '数据', '活动'].map(tag => 
            h('button', { class: 'rounded-lg border-2 border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-uma-turf hover:text-uma-turf hover:bg-white' }, tag)
          )
        )
      ]),

      // 3. 本周活动
      h('div', { class: 'uma-card p-0 overflow-hidden' }, [
        h('div', { class: 'bg-yellow-400 px-5 py-3 flex items-center gap-2' }, [
           h(TrendingUp, { class: 'h-4 w-4 text-yellow-900 stroke-[3px]' }),
           h('h3', { class: 'text-sm font-black text-yellow-900 uppercase' }, '最新动态')
        ]),
        h('div', { class: 'p-4 space-y-4 bg-white' }, [
          h('div', { class: 'flex gap-3 items-start group cursor-pointer' }, [
            h('div', { class: 'h-12 w-12 shrink-0 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl' }, '📰'), 
            h('div', [
              h('h4', { class: 'text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-yellow-600 transition-colors' }, '新剧本"Onsen"速报：剧本机制详解'),
              h('span', { class: 'text-[10px] font-bold text-slate-400' }, '2 hours ago')
            ])
          ]),
          h('div', { class: 'w-full h-[1px] bg-slate-100' }),
          h('div', { class: 'flex gap-3 items-start group cursor-pointer' }, [
             h('div', { class: 'h-12 w-12 shrink-0 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl' }, '💬'), 
            h('div', [
              h('h4', { class: 'text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-yellow-600 transition-colors' }, 'Onsen杯唉唉真的要复活了吗？'),
              h('span', { class: 'text-[10px] font-bold text-slate-400' }, '5 hours ago')
            ])
          ])
        ])
      ])

    ])
  }
})
</script>

<style scoped>
/* 导航栏装饰条 */
header::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background: repeating-linear-gradient(
    45deg,
    #69C05B,
    #69C05B 10px,
    #58A04C 10px,
    #58A04C 20px
  );
}
</style>
