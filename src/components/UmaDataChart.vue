<template>
  <div class="chart-wrapper w-full overflow-x-auto sm:overflow-visible">
    <div ref="chartRef" class="chart min-w-[480px] sm:min-w-0" />
  </div>
  <p v-if="!hasData" class="chart__placeholder">No data yet. Try adjusting your filters.</p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import * as echarts from "echarts"

interface ChartPayload {
  dates: string[]
  totalFans: number[]
  dailyNewFans: number[]
}

const props = defineProps<{ chartData: ChartPayload }>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const hasData = computed(() => Boolean(props.chartData?.dates?.length))

const renderChart = () => {
  if (!chartRef.value) return
  if (!hasData.value) {
    disposeChart()
    return
  }
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  // 检测是否为移动设备
  const isMobile = window.innerWidth < 640
  
  // Uma Colors
  const colors = {
    turf: '#69C05B',
    ura: '#FF8EA9',
    text: '#334155', // slate-700
    subtext: '#94a3b8', // slate-400
    grid: '#e2e8f0', // slate-200
    tooltipBg: 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: '#e2e8f0'
  }

  const option: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: {
        color: colors.text,
        fontSize: isMobile ? 11 : 14,
        fontWeight: 'bold'
      },
      extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px;'
    },
    legend: {
      data: ["Total Fans", "Daily New Fans"],
      top: 0,
      textStyle: {
        color: colors.text,
        fontSize: isMobile ? 10 : 12,
        fontWeight: 'bold'
      },
      itemWidth: isMobile ? 20 : 25,
      itemHeight: isMobile ? 12 : 14,
      inactiveColor: "#cbd5e1" // slate-300
    },
    grid: {
      top: isMobile ? 42 : 48,
      right: isMobile ? 10 : 32,
      bottom: isMobile ? 30 : 48,
      left: isMobile ? 10 : 60,
      containLabel: true,
      borderColor: colors.grid
    },
    xAxis: {
      type: "category",
      data: props.chartData.dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: colors.grid
        }
      },
      axisLabel: {
        color: colors.subtext,
        fontSize: isMobile ? 9 : 12,
        rotate: isMobile ? 45 : 0,
        interval: isMobile ? 'auto' : 0,
        fontWeight: 'bold'
      }
    },
    yAxis: [
      {
        type: "value",
        name: isMobile ? "" : "Total Fans",
        nameTextStyle: {
          color: colors.subtext,
          fontSize: isMobile ? 10 : 12,
          fontWeight: 'bold'
        },
        splitLine: {
          lineStyle: {
            color: colors.grid,
            type: 'dashed'
          }
        },
        axisLabel: {
          color: colors.subtext,
          fontSize: isMobile ? 9 : 12,
          formatter: (value: number) => {
            if (isMobile && value >= 1000) {
              return (value / 1000).toFixed(0) + 'K'
            }
            return value.toString()
          },
          fontWeight: 'bold'
        }
      },
      {
        type: "value",
        name: isMobile ? "" : "Daily New",
        position: "right",
        alignTicks: true,
        nameTextStyle: {
          color: colors.subtext,
          fontSize: isMobile ? 10 : 12,
          fontWeight: 'bold'
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: colors.subtext,
          fontSize: isMobile ? 9 : 12,
          formatter: (value: number) => {
            if (isMobile && value >= 1000) {
              return (value / 1000).toFixed(0) + 'K'
            }
            return value.toString()
          },
          fontWeight: 'bold'
        }
      }
    ],
    series: [
      {
        name: "Total Fans",
        type: "line",
        smooth: true,
        data: props.chartData.totalFans,
        lineStyle: { width: isMobile ? 3 : 4, color: colors.turf },
        itemStyle: { color: colors.turf },
        showSymbol: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(105, 192, 91, 0.2)" }, // turf green with opacity
            { offset: 1, color: "rgba(105, 192, 91, 0.0)" }
          ])
        }
      },
      {
        name: "Daily New Fans",
        type: "bar",
        yAxisIndex: 1,
        data: props.chartData.dailyNewFans,
        itemStyle: {
          color: colors.ura,
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: isMobile ? '60%' : '50%'
      }
    ]
  }
  chartInstance.setOption(option, true)
}

const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

onMounted(() => {
  renderChart()
  window.addEventListener("resize", renderChart)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", renderChart)
  disposeChart()
})

watch(
  () => props.chartData,
  () => {
    renderChart()
  },
  { deep: true }
)
</script>

<style scoped>
.chart-wrapper {
  max-width: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: clamp(280px, 60vw, 400px);
  min-height: 280px;
}

@media (max-width: 640px) {
  .chart {
    height: clamp(300px, 70vh, 450px);
    min-height: 300px;
  }
}

.chart__placeholder {
  margin: 0;
  padding: clamp(80px, 35vw, 120px) 0;
  text-align: center;
  color: #94a3b8; /* slate-400 */
  border: 4px dashed #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  font-weight: bold;
}
</style>
