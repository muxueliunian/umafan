<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import UmaDataChart from "./UmaDataChart.vue"
import { Button } from "@/components/ui/button"
import { getUmaOptions, getUmaOverview, type CircleOption, type UmaOverview } from "@/umafan/dataLoader"

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
      selectedCircleId.value = options.circles[0]?.id ?? null
    }

    if (options.dates.length) {
      selectedEndDate.value = options.dates[options.dates.length - 1] ?? ""
      const startIndex = Math.max(0, options.dates.length - 7)
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
  <div class="space-y-10 sm:space-y-12">
    <section class="rounded-[32px] border border-white/10 bg-background/80 p-6 sm:p-8 md:p-10 shadow-[0_30px_60px_-50px_rgba(91,91,214,0.6)] backdrop-blur">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Uma Fan Data</p>
          <h1 class="text-3xl font-bold sm:text-4xl">gugugaga🐧的社团粉丝查询网站</h1>
          <p class="max-w-2xl text-xs sm:text-sm text-muted-foreground sm:text-base">
            点这个Circle然后找摩羯设2会就行了，因为用的是之前写的一个网站的模板所以是全英文，不过也不影响所以我懒得改中文了，可能过几天会加一个切换语言的选项，我琢磨琢磨怎么弄
            <br>.|| <br>
            \/
          </p>
        </div>
        <div class="flex flex-col items-start gap-3 md:items-end">
          <span class="rounded-full border border-white/15 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-muted-foreground">{{ activeCircleName }}</span>
          <span class="text-xs sm:text-sm text-muted-foreground">Current range: <strong class="font-semibold text-foreground">{{ selectedRangeLabel }}</strong></span>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <label class="flex w-full flex-col gap-2 text-sm font-medium text-muted-foreground">
          Circle
          <select
            v-model.number="selectedCircleId"
            :disabled="initializing || !circles.length"
            class="h-11 w-full rounded-xl border-2 border-white/15 bg-background/90 px-4 text-base font-semibold text-foreground outline-none transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option v-if="!circles.length" value="">No circles available</option>
            <option v-for="circle in circles" :key="circle.id" :value="circle.id">
              {{ circle.name }} (ID: {{ circle.id }})
            </option>
          </select>
        </label>
        <label class="flex w-full flex-col gap-2 text-sm font-medium text-muted-foreground">
          Start date
          <select
            v-model="selectedStartDate"
            :disabled="initializing || !dates.length"
            class="h-11 w-full rounded-xl border-2 border-white/15 bg-background/90 px-4 text-base font-semibold text-foreground outline-none transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option v-for="date in dates" :key="`${date}-start`" :value="date">
              {{ formatDate(date) }}
            </option>
          </select>
        </label>
        <label class="flex w-full flex-col gap-2 text-sm font-medium text-muted-foreground">
          End date
          <select
            v-model="selectedEndDate"
            :disabled="initializing || !dates.length"
            class="h-11 w-full rounded-xl border-2 border-white/15 bg-background/90 px-4 text-base font-semibold text-foreground outline-none transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option v-for="date in dates" :key="`${date}-end`" :value="date">
              {{ formatDate(date) }}
            </option>
          </select>
        </label>
      </div>

      <div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span class="rounded-full bg-primary/10 px-3 py-1 text-primary">Data directory: {{ directory || "static://umafan-data" }}</span>
          <span>Static builds automatically collect JSON files from <code class="rounded-md bg-black/20 px-1.5 py-0.5 text-[11px] text-primary-foreground">src/umafan/data</code>.</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button
            v-for="days in quickRanges"
            :key="days"
            :variant="selectedRangeDays === days ? 'default' : 'outline'"
            size="sm"
            class="rounded-full px-4 text-xs tracking-[0.2em]"
            :disabled="!dates.length"
            @click="setQuickRange(days)"
          >
            Last {{ days }} days
          </Button>
          <Button
            variant="secondary"
            size="sm"
            class="rounded-full px-5 text-xs tracking-[0.3em]"
            :disabled="isBusy || !selectedCircleId || !selectedStartDate || !selectedEndDate"
            @click="refreshOverview"
          >
            {{ isRefreshing ? "Refreshing..." : "Manual refresh" }}
          </Button>
        </div>
      </div>

      <p
        v-if="initializing"
        class="mt-6 rounded-2xl border border-dashed border-white/20 bg-background/70 px-6 py-4 text-xs sm:text-sm text-muted-foreground"
      >
        Loading static data, please wait...
      </p>
      <p
        v-else-if="!isBusy && !hasOverview && !error"
        class="mt-6 rounded-2xl border border-dashed border-white/20 bg-background/70 px-6 py-4 text-xs sm:text-sm text-muted-foreground"
      >
        No records for this combination. Try a different circle or date range.
      </p>
    </section>

    <p
      v-if="error"
      class="rounded-3xl border border-destructive/40 bg-destructive/10 px-6 py-4 text-sm text-destructive"
    >
      {{ error }}
    </p>

    <section class="grid gap-4 md:gap-6 md:grid-cols-3">
      <article class="rounded-3xl border border-white/10 bg-background/80 p-4 sm:p-6 shadow-[0_35px_80px_-60px_rgba(92,225,230,0.45)]">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Total growth</p>
        <h3 class="mt-3 text-2xl sm:text-3xl font-black text-primary">{{ formatNumber(metrics.fansTotalGrowth) }}</h3>
        <p class="mt-3 text-xs sm:text-sm text-muted-foreground">Circle-wide fan gain across the selected window</p>
      </article>
      <article class="rounded-3xl border border-white/10 bg-background/80 p-4 sm:p-6 shadow-[0_35px_80px_-60px_rgba(255,111,183,0.45)]">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Today</p>
        <h3 class="mt-3 text-2xl sm:text-3xl font-black text-secondary">{{ formatNumber(metrics.todayNewFans) }}</h3>
        <p class="mt-3 text-xs sm:text-sm text-muted-foreground">Net new fans compared with the previous day</p>
      </article>
      <article class="rounded-3xl border border-white/10 bg-background/80 p-4 sm:p-6 shadow-[0_35px_80px_-60px_rgba(91,91,214,0.45)]">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Activity</p>
        <h3 class="mt-3 text-2xl font-semibold text-foreground">{{ metrics.activityStatus }}</h3>
        <p class="mt-3 text-xs sm:text-sm text-muted-foreground">{{ metrics.activityNote }}</p>
      </article>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-background/80 p-6 sm:p-8 md:p-10 shadow-[0_35px_80px_-60px_rgba(91,91,214,0.45)]">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold">Fan trends</h2>
          <p class="text-xs sm:text-sm text-muted-foreground">Compare cumulative fans and daily gains at a glance</p>
        </div>
        <span class="rounded-full bg-primary/10 px-3 sm:px-4 py-1 text-xs font-semibold tracking-[0.28em] text-primary">Auto update</span>
      </div>
      <div class="mt-4 sm:mt-6">
        <UmaDataChart :chart-data="chartData" />
      </div>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-background/80 p-6 sm:p-8 md:p-10 shadow-[0_35px_80px_-60px_rgba(92,225,230,0.45)]">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold">Member leaderboard</h2>
          <p class="text-xs sm:text-sm text-muted-foreground">Fan growth for each member, ranked by increase</p>
        </div>
        <span class="text-xs text-muted-foreground">{{ tableRows.length }} members</span>
      </header>
      <div class="mt-4 sm:mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table class="w-full border-separate border-spacing-0 text-left text-xs sm:text-sm text-foreground">
          <thead class="bg-primary/10 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary">
            <tr>
              <th class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">Member ID</th>
              <th class="px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">Name</th>
              <th class="px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">Increase</th>
              <th class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">Start fans</th>
              <th class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">End fans</th>
              <th class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 font-semibold whitespace-nowrap">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!tableRows.length">
              <td colspan="6" class="px-4 py-5 sm:px-6 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground">
                No member data yet. Try adjusting your filters.
              </td>
            </tr>
            <tr
              v-for="row in tableRows"
              :key="row.playerId"
              class="border-t border-white/5 transition hover:bg-primary/5"
            >
              <td class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 font-medium">{{ row.playerId }}</td>
              <td class="px-3 py-3 sm:px-5 sm:py-4">{{ row.name || "-" }}</td>
              <td class="px-3 py-3 sm:px-5 sm:py-4 font-semibold text-primary">{{ formatNumber(row.increase) }}</td>
              <td class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 text-muted-foreground">{{ formatNumber(row.startFans) }}</td>
              <td class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 text-muted-foreground">{{ formatNumber(row.endFans) }}</td>
              <td class="hidden sm:table-cell px-3 py-3 sm:px-5 sm:py-4 text-muted-foreground">{{ row.comment || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-[32px] border border-dashed border-white/20 bg-background/60 p-6 sm:p-8">
      <h2 class="text-lg sm:text-xl font-semibold">📱 Mobile Optimized</h2>
      <p class="mt-3 text-xs sm:text-sm text-muted-foreground">This dashboard is now fully optimized for mobile devices with responsive charts and improved touch interactions.</p>
      <!-- <h2 class="text-xl font-semibold">Adding new UMA data</h2>
      <ol class="mt-4 list-decimal space-y-2 pl-5 text-xs sm:text-sm text-muted-foreground">
        <li>Add <code class="rounded-md bg-black/20 px-1.5 py-0.5 text-[11px] text-primary-foreground">YYYYMMDD.json</code> files to <code class="rounded-md bg-black/20 px-1.5 py-0.5 text-[11px] text-primary-foreground">src/umafan/data</code>.</li>
        <li>Match the original structure: outer keys are viewer IDs and values include <code class="font-mono">fan</code>, <code class="font-mono">circle_id</code>, and related fields.</li>
        <li>Run <code class="rounded-md bg-black/20 px-1.5 py-0.5 text-[11px] text-primary-foreground">npm run dev</code> or rebuild to surface the latest data in the dashboard.</li>
        <li>For circle-specific previews, split JSON files per circle. The system will detect circle IDs and names automatically.</li>
      </ol>
      <p class="mt-4 text-xs text-muted-foreground">Everything is computed on the client, so static hosting is sufficient for deployment.</p> --> 
    </section>
  </div>
</template>








