<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import UmaDataChart from "./UmaDataChart.vue"

import { getUmaOptions, getUmaOverview, type CircleOption, type UmaOverview } from "@/umafan/dataLoader"
import { ElSelect, ElOption } from 'element-plus'
import 'element-plus/dist/index.css'





const initializing = ref(true)
const isRefreshing = ref(false)
const error = ref<string | null>(null)

const directory = ref("")
const circles = ref<CircleOption[]>([])
const dates = ref<string[]>([])

const selectedCircleId = ref<number | null>(null)
const selectedStartDate = ref<string>("")
const selectedEndDate = ref<string>("")

const overview = ref<UmaOverview | null>(null)
const optionsReady = ref(false)

const numberFormatter = new Intl.NumberFormat("en-US")

//获取具体日期 day
const date: Date = new Date();
const day: number = date.getDate();



const hasOverview = computed(() => Boolean(overview.value))
const metrics = computed(() => overview.value?.metrics ?? {
  fansTotalGrowth: 0,
  todayNewFans: 0,
  activityStatus: "Pending",
  activityNote: "Data not loaded yet"
})
const chartData = computed(() => overview.value?.chart ?? { dates: [], totalFans: [], dailyNewFans: [] })
const tableRows = computed(() => overview.value?.table ?? [])
const activeCircleName = computed(
  () => circles.value.find((item) => item.id === selectedCircleId.value)?.name ?? "No circle selected"
)
const selectedRangeLabel = computed(() => {
  if (!selectedStartDate.value || !selectedEndDate.value) return "No range selected"
  return `${formatDate(selectedStartDate.value)} ~ ${formatDate(selectedEndDate.value)}`
})
const selectedRangeDays = computed(() => {
  const startIndex = dates.value.indexOf(selectedStartDate.value)
  const endIndex = dates.value.indexOf(selectedEndDate.value)
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) return 0
  return endIndex - startIndex + 1
})
const quickRanges = [3, 7, 14, 30]
const isBusy = computed(() => initializing.value || isRefreshing.value)

watch([selectedCircleId, selectedStartDate, selectedEndDate], () => {
  if (!optionsReady.value) return
  refreshOverview()
})

function formatDate(value: string) {
  if (!value || value.length !== 8) return value
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`
}

function formatNumber(value: number) {
  return numberFormatter.format(value ?? 0)
}

function setQuickRange(days: number) {
  if (!dates.value.length) return
  const fallbackEnd = dates.value[dates.value.length - 1] ?? ""
  const endValue = selectedEndDate.value || fallbackEnd
  if (!endValue) return
  const endIndex = dates.value.indexOf(endValue)
  if (endIndex === -1) return
  const startIndex = Math.max(0, endIndex - (days - 1))
  const startValue = dates.value[startIndex] ?? ""
  if (!startValue) return
  selectedEndDate.value = endValue
  selectedStartDate.value = startValue
}

function refreshOverview() {
  if (!selectedCircleId.value || !selectedStartDate.value || !selectedEndDate.value) return
  isRefreshing.value = true
  try {
    overview.value = getUmaOverview(selectedCircleId.value, selectedStartDate.value, selectedEndDate.value)
    error.value = null
  } catch (err) {
    overview.value = null
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    isRefreshing.value = false
  }
}

function initialize() {
  try {
    const options = getUmaOptions()
    directory.value = options.directory
    circles.value = options.circles
    dates.value = options.dates

    if (options.circles.length) {
      // 默认社团ID: 391405678 (摩羯設2會)
      const DEFAULT_CIRCLE_ID = 391405678

      // 检查默认社团是否存在
      const defaultCircle = options.circles.find(c => c.id === DEFAULT_CIRCLE_ID)

      // 如果默认社团存在，使用它；否则使用第一个社团
      selectedCircleId.value = defaultCircle?.id ?? options.circles[0]?.id ?? null
    }

    if (options.dates.length) {
      selectedEndDate.value = options.dates[options.dates.length - 1] ?? ""
      const startIndex = Math.max(0, options.dates.length - day)
      selectedStartDate.value = options.dates[startIndex] ?? ""
    }

    optionsReady.value = true

    if (selectedCircleId.value && selectedStartDate.value && selectedEndDate.value) {
      refreshOverview()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    initializing.value = false
  }
}

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="space-y-8 sm:space-y-10">
    
    <!-- 🎛️ 控制面板 -->
    <section class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 sm:p-8">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Uma Fan Data</p>
          <h1 class="text-2xl font-bold text-white sm:text-3xl">社团粉丝数据查询</h1>
          <p class="max-w-2xl text-xs text-slate-400 sm:text-sm">
            选择社团和日期范围，查看详细的粉丝增长趋势与成员排名。
          </p>
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            {{ activeCircleName }}
          </span>
          <span class="text-xs text-slate-500">
            Range: <strong class="text-slate-300">{{ selectedRangeLabel }}</strong>
          </span>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <label class="flex w-full flex-col gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Circle
          <el-select
            v-model="selectedCircleId"
            :disabled="initializing || !circles.length"
            filterable
            placeholder="Select circle..."
            size="large"
            class="w-full el-select-glass"
            popper-class="el-select-glass-popper"
          >
            <template v-for="circle in circles" :key="circle.id">
              <el-option
                v-if="circle.id != null"
                :value="circle.id"
                :label="`${circle.name} (ID: ${circle.id})`"
              />
            </template>
          </el-select>
        </label>
        <label class="flex w-full flex-col gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Start date
          <el-select
            v-model="selectedStartDate"
            :disabled="initializing || !dates.length"
            placeholder="Select start date..."
            size="large"
            class="w-full el-select-glass"
            popper-class="el-select-glass-popper"
          >
            <el-option
              v-for="date in dates"
              :key="`${date}-start`"
              :value="date"
              :label="formatDate(date)"
            />
          </el-select>
        </label>
        <label class="flex w-full flex-col gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          End date
          <el-select
            v-model="selectedEndDate"
            :disabled="initializing || !dates.length"
            placeholder="Select end date..."
            size="large"
            class="w-full el-select-glass"
            popper-class="el-select-glass-popper"
          >
            <el-option
              v-for="date in dates"
              :key="`${date}-end`"
              :value="date"
              :label="formatDate(date)"
            />
          </el-select>
        </label>
      </div>

      <!-- 快捷操作 -->
      <div class="mt-8 flex flex-col gap-4 border-t border-white/5 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-2 text-xs text-slate-500">Quick Range:</span>
          <button 
            v-for="days in quickRanges" 
            :key="days" 
            @click="setQuickRange(days)"
            :disabled="!dates.length"
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium transition-all',
              selectedRangeDays === days 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            ]"
          >
            {{ days }}D
          </button>
        </div>
        <button 
          @click="refreshOverview"
          :disabled="isBusy || !selectedCircleId || !selectedStartDate || !selectedEndDate"
          class="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 disabled:opacity-50"
        >
          {{ isRefreshing ? "Refreshing..." : "Refresh Data" }}
        </button>
      </div>
    </section>

    <!-- ⚠️ 状态提示 -->
    <div v-if="error" class="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
      {{ error }}
    </div>
    <div v-else-if="!isBusy && !hasOverview" class="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
      No data available. Please select a circle and date range.
    </div>

    <!-- 📊 核心指标 -->
    <section v-if="hasOverview" class="grid gap-4 md:grid-cols-3">
      <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30">
        <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20"></div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Growth</p>
        <h3 class="mt-2 text-3xl font-black text-white">{{ formatNumber(metrics.fansTotalGrowth) }}</h3>
        <p class="mt-2 text-xs text-slate-400">Fans gained in selected period</p>
      </div>
      
      <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-purple-500/30">
        <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition-all group-hover:bg-purple-500/20"></div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Daily New</p>
        <h3 class="mt-2 text-3xl font-black text-white">{{ formatNumber(metrics.todayNewFans) }}</h3>
        <p class="mt-2 text-xs text-slate-400">New fans today</p>
      </div>

      <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30">
        <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20"></div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
        <h3 class="mt-2 text-2xl font-bold text-white">{{ metrics.activityStatus }}</h3>
        <p class="mt-2 text-xs text-slate-400">{{ metrics.activityNote }}</p>
      </div>
    </section>

    <!-- 📈 趋势图表 -->
    <!--
    <section v-if="hasOverview" class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Fan Trends</h2>
        <span class="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
      </div>
      <div class="h-[300px] w-full sm:h-[400px]">
        <UmaDataChart :chart-data="chartData" />
      </div>
    </section>
    -->

    <!-- 🏆 排行榜 -->
    <section v-if="hasOverview" class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h2 class="text-lg font-bold text-white">Member Leaderboard</h2>
          <p class="text-xs text-slate-400">Ranked by fan increase</p>
        </div>
        <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">{{ tableRows.length }} Members</span>
      </div>
      
      <div class="overflow-hidden rounded-2xl border border-white/5 bg-black/20">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-6 py-4 font-medium">Rank</th>
                <th class="px-6 py-4 font-medium">Member</th>
                <th class="px-6 py-4 font-medium text-right">Increase</th>
                <th class="hidden px-6 py-4 font-medium text-right sm:table-cell">Total Fans</th>
                <th class="hidden px-6 py-4 font-medium sm:table-cell">Note</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="(row, index) in tableRows" :key="row.playerId" class="group transition-colors hover:bg-white/5">
                <td class="px-6 py-4 font-mono text-slate-500 group-hover:text-white">#{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-medium text-white">{{ row.name || "-" }}</div>
                  <div class="text-xs text-slate-500">ID: {{ row.playerId }}</div>
                </td>
                <td class="px-6 py-4 text-right font-bold text-blue-400 group-hover:text-blue-300">
                  +{{ formatNumber(row.increase) }}
                </td>
                <td class="hidden px-6 py-4 text-right font-mono text-slate-400 sm:table-cell">
                  {{ formatNumber(row.endFans) }}
                </td>
                <td class="hidden px-6 py-4 text-xs text-slate-500 sm:table-cell">
                  {{ row.comment || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </div>
</template>

<style>
/* ElementPlus Select 玻璃风格 - 使用 CSS 变量覆盖 */
.el-select-glass {
  --el-fill-color-blank: rgba(0, 0, 0, 0.3) !important;
  --el-text-color-regular: #f1f5f9 !important; /* slate-100 */
  --el-text-color-placeholder: #94a3b8 !important; /* slate-400 */
  --el-border-color: rgba(255, 255, 255, 0.15) !important;
  --el-border-color-hover: #3b82f6 !important; /* blue-500 */
  --el-disabled-bg-color: rgba(0, 0, 0, 0.2) !important;
  --el-disabled-text-color: rgba(148, 163, 184, 0.5) !important;
  --el-disabled-border-color: rgba(255, 255, 255, 0.05) !important;
  width: 100%;
}

.el-select-glass .el-select__wrapper {
  height: 44px;
  border-radius: 12px;
  box-shadow: none !important;
  background-color: var(--el-fill-color-blank);
  border: 2px solid var(--el-border-color);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  transition: all 0.2s;
}

/* Element Plus 2.3+ uses .el-select__wrapper instead of .el-input__wrapper for the new select design */
.el-select-glass .el-select__wrapper:hover {
  border-color: var(--el-border-color-hover);
  background-color: rgba(255, 255, 255, 0.05);
}

.el-select-glass .el-select__wrapper.is-focused {
  border-color: #3b82f6 !important;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

/* 兼容旧版结构 (以防万一) */
.el-select-glass .el-input__wrapper {
  height: 44px;
  border-radius: 12px;
  box-shadow: none !important;
  background-color: var(--el-fill-color-blank) !important;
  border: 2px solid var(--el-border-color) !important;
  backdrop-filter: blur(10px);
  padding: 0 16px;
}

.el-select-glass .el-input__wrapper:hover {
  border-color: var(--el-border-color-hover) !important;
}

.el-select-glass .el-input__inner {
  color: var(--el-text-color-regular) !important;
  font-weight: 500;
}

/* 下拉面板 */
.el-select-glass-popper {
  --el-bg-color-overlay: rgba(15, 23, 42, 0.95) !important; /* slate-950 */
  --el-border-color-light: rgba(255, 255, 255, 0.1) !important;
  --el-text-color-primary: #cbd5e1 !important; /* slate-300 */
  --el-fill-color-light: rgba(255, 255, 255, 0.05) !important; /* hover bg */
}

.el-select-glass-popper.el-popper {
  background-color: var(--el-bg-color-overlay) !important;
  border: 1px solid var(--el-border-color-light) !important;
  backdrop-filter: blur(20px);
  border-radius: 12px;
}

.el-select-glass-popper .el-select-dropdown__item {
  color: var(--el-text-color-primary);
  padding: 10px 20px;
  height: auto;
}

.el-select-glass-popper .el-select-dropdown__item.hover,
.el-select-glass-popper .el-select-dropdown__item:hover {
  background-color: var(--el-fill-color-light);
  color: #fff;
}

.el-select-glass-popper .el-select-dropdown__item.is-selected {
  color: #60a5fa; /* blue-400 */
  font-weight: 600;
  background-color: rgba(59, 130, 246, 0.15);
}

/* 搜索框样式 (如果在下拉框中启用过滤) */
.el-select-glass-popper .el-input__wrapper {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none !important;
}

.el-select-glass-popper .el-input__inner {
  color: #fff;
}
</style>
