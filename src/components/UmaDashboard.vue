<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import UmaDataChart from "./UmaDataChart.vue"

import { getUmaOptions, getUmaOverview, type CircleOption, type UmaOverview } from "@/umafan/dataLoader"
// import { ElSelect, ElOption } from 'element-plus'

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
      const defaultCircle = options.circles.find(c => c.id === DEFAULT_CIRCLE_ID)
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
    
    <!-- 🎛️ 控制面板 (Game Menu Style) -->
    <section class="uma-card p-6 sm:p-8 bg-white border-b-4 border-slate-200">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-6 border-slate-100">
        <div class="space-y-2">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-uma-turf">Uma Fan Data</p>
          <h1 class="text-2xl font-black text-slate-800 sm:text-3xl">社团粉丝数据查询</h1>
          <p class="max-w-2xl text-xs font-bold text-slate-400 sm:text-sm">
            SELECT CRICLE & DATE RANGE
          </p>
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <span class="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-600 border border-slate-200">
            {{ activeCircleName }}
          </span>
          <span class="text-xs font-bold text-slate-400">
            Range: <strong class="text-uma-blue">{{ selectedRangeLabel }}</strong>
          </span>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="mt-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        <label class="flex w-full flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
          <span class="truncate pl-1">Circle</span>
          <el-select
            v-model="selectedCircleId"
            :disabled="initializing || !circles.length"
            filterable
            placeholder="Select Circle"
            size="large"
            class="w-full el-select-uma"
            popper-class="el-select-uma-popper"
          >
            <template v-for="circle in circles" :key="circle.id">
              <el-option
                v-if="circle.id != null"
                :value="circle.id"
                :label="`${circle.name}`"
              />
            </template>
          </el-select>
        </label>
        <label class="flex w-full flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
          <span class="truncate pl-1">Start Date</span>
          <el-select
            v-model="selectedStartDate"
            :disabled="initializing || !dates.length"
            placeholder="Start"
            size="large"
            class="w-full el-select-uma"
            popper-class="el-select-uma-popper"
          >
            <el-option
              v-for="date in dates"
              :key="`${date}-start`"
              :value="date"
              :label="formatDate(date)"
            />
          </el-select>
        </label>
        <label class="flex w-full flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
          <span class="truncate pl-1">End Date</span>
          <el-select
            v-model="selectedEndDate"
            :disabled="initializing || !dates.length"
            placeholder="End"
            size="large"
            class="w-full el-select-uma"
            popper-class="el-select-uma-popper"
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
      <div class="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-2 text-xs font-bold text-slate-400 uppercase">Quick Range:</span>
          <button 
            v-for="days in quickRanges" 
            :key="days" 
            @click="setQuickRange(days)"
            :disabled="!dates.length"
            :class="[
              'rounded-lg px-4 py-1.5 text-xs font-black transition-all border-b-2 active:border-b-0 active:translate-y-[2px]',
              selectedRangeDays === days 
                ? 'bg-uma-turf text-white border-green-700 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            ]"
          >
            {{ days }}D
          </button>
        </div>
        <button 
          @click="refreshOverview"
          :disabled="isBusy || !selectedCircleId || !selectedStartDate || !selectedEndDate"
          class="flex items-center justify-center gap-2 rounded-full bg-uma-blue border-b-4 border-blue-700 px-8 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isRefreshing ? "Refreshing..." : "Refresh Data" }}
        </button>
      </div>
    </section>

    <!-- ⚠️ 状态提示 -->
    <div v-if="error" class="rounded-xl border-l-4 border-red-500 bg-white p-4 text-sm font-bold text-red-500 shadow-sm">
      ERROR: {{ error }}
    </div>
    <div v-else-if="!isBusy && !hasOverview" class="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-400 bg-white/50">
      No data available. Please select a circle and date range.
    </div>

    <!-- 📊 核心指标 (Card Style) -->
    <section v-if="hasOverview" class="grid gap-4 grid-cols-1 md:grid-cols-3">
      <!-- Total Growth -->
      <div class="uma-card p-5 border-t-8 border-t-uma-turf relative overflow-hidden group">
        <div class="absolute right-0 top-0 p-4 opacity-10">
           <svg class="w-20 h-20" viewBox="0 0 24 24" fill="currentColor"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" /></svg>
        </div>
        <p class="text-xs font-black uppercase tracking-wider text-slate-400">Total Growth</p>
        <h3 class="mt-2 text-3xl font-black text-uma-turf tracking-tighter">{{ formatNumber(metrics.fansTotalGrowth) }}</h3>
        <p class="mt-1 text-xs font-bold text-slate-500">Fans gained</p>
      </div>
      
      <!-- Daily New -->
      <div class="uma-card p-5 border-t-8 border-t-uma-ura relative overflow-hidden group">
        <div class="absolute right-0 top-0 p-4 opacity-10 text-uma-ura">
           <svg class="w-20 h-20" viewBox="0 0 24 24" fill="currentColor"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
        </div>
        <p class="text-xs font-black uppercase tracking-wider text-slate-400">Daily New</p>
        <h3 class="mt-2 text-3xl font-black text-uma-ura tracking-tighter">{{ formatNumber(metrics.todayNewFans) }}</h3>
        <p class="mt-1 text-xs font-bold text-slate-500">New fans today</p>
      </div>

      <!-- Status -->
      <div class="uma-card p-5 border-t-8 border-t-uma-blue relative overflow-hidden group">
        <div class="absolute right-0 top-0 p-4 opacity-10 text-uma-blue">
           <svg class="w-20 h-20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" /></svg>
        </div>
        <p class="text-xs font-black uppercase tracking-wider text-slate-400">Status</p>
        <h3 class="mt-2 text-2xl font-black text-uma-blue tracking-tighter uppercase">{{ metrics.activityStatus }}</h3>
        <p class="mt-1 text-xs font-bold text-slate-500">{{ metrics.activityNote }}</p>
      </div>
    </section>

    <!-- 📈 趋势图表 (Re-enabled) -->
    <section v-if="hasOverview" class="uma-card p-6 sm:p-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
            <span class="text-uma-blue">#</span> Fan Trends
          </h2>
          <p class="text-xs font-bold text-slate-400 uppercase">Daily fan growth history</p>
        </div>
      </div>
      <div class="h-[300px] w-full sm:h-[400px]">
        <UmaDataChart :chart-data="chartData" />
      </div>
    </section>

    <!-- 🏆 排行榜 (Table Style) -->
    <section v-if="hasOverview" class="uma-card overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
            <span class="text-uma-dirt">#</span> Member Leaderboard
          </h2>
          <p class="text-xs font-bold text-slate-400 uppercase">Ranked by fan increase</p>
        </div>
        <span class="rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 shadow-sm">
          {{ tableRows.length }} Members
        </span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-100 text-xs font-black uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-6 py-4">Rank</th>
              <th class="px-6 py-4">Member</th>
              <th class="px-6 py-4 text-right">Increase</th>
              <th class="hidden px-6 py-4 text-right sm:table-cell">Total Fans</th>
              <th class="hidden px-6 py-4 sm:table-cell">Note</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, index) in tableRows" :key="row.playerId" class="group transition-colors hover:bg-yellow-50 bg-white even:bg-slate-50/50">
              <td class="px-6 py-4 font-black">
                <span :class="[
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-slate-300 text-slate-700' :
                  index === 2 ? 'bg-orange-300 text-orange-800' :
                  'bg-slate-100 text-slate-500'
                ]">
                  {{ index + 1 }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800 group-hover:text-uma-blue">{{ row.name || "-" }}</div>
                <div class="text-[10px] font-bold text-slate-400">ID: {{ row.playerId }}</div>
              </td>
              <td class="px-6 py-4 text-right font-black text-uma-turf text-base">
                +{{ formatNumber(row.increase) }}
              </td>
              <td class="hidden px-6 py-4 text-right font-mono font-bold text-slate-500 sm:table-cell">
                {{ formatNumber(row.endFans) }}
              </td>
              <td class="hidden px-6 py-4 text-xs font-medium text-slate-400 sm:table-cell">
                {{ row.comment || "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<style>
/* Uma Style Select */
.el-select-uma {
  --el-fill-color-blank: #ffffff !important;
  --el-text-color-regular: #334155 !important;
  --el-text-color-placeholder: #94a3b8 !important;
  --el-border-color: #e2e8f0 !important;
  --el-border-color-hover: #69C05B !important; /* uma-turf */
}

.el-select-uma .el-select__wrapper {
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
  padding: 8px 12px;
  font-weight: 700;
  transition: all 0.2s;
}

.el-select-uma .el-select__wrapper.is-focused,
.el-select-uma .el-select__wrapper:hover {
  box-shadow: 0 0 0 4px #dcfce7 !important; /* green-100 */
}

/* 下拉面板 */
.el-select-uma-popper {
  --el-bg-color-overlay: #ffffff !important;
  --el-border-color-light: #e2e8f0 !important;
  --el-text-color-primary: #334155 !important;
  --el-fill-color-light: #f1f5f9 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
}

.el-select-uma-popper .el-select-dropdown__item {
  font-weight: 600;
}

.el-select-uma-popper .el-select-dropdown__item.is-selected {
  color: #69C05B !important;
  background-color: #f0fdf4 !important;
}
</style>
