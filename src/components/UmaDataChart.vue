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

  const option: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-950
      borderColor: "rgba(255, 255, 255, 0.1)",
      textStyle: {
        color: "#f1f5f9", // slate-100
        fontSize: isMobile ? 11 : 14
      }
    },
    legend: {
      data: ["Total Fans", "Daily New Fans"],
      top: 0,
      textStyle: {
        color: "#94a3b8", // slate-400
        fontSize: isMobile ? 10 : 12
      },
      itemWidth: isMobile ? 20 : 25,
      itemHeight: isMobile ? 12 : 14,
      inactiveColor: "#475569" // slate-600
    },
    grid: {
      top: isMobile ? 42 : 48,
      right: isMobile ? 10 : 32,
      bottom: isMobile ? 30 : 48,
      left: isMobile ? 10 : 60,
      containLabel: true,
      borderColor: "rgba(255, 255, 255, 0.1)"
    },
    xAxis: {
      type: "category",
      data: props.chartData.dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      },
      axisLabel: {
        color: "#94a3b8", // slate-400
        fontSize: isMobile ? 9 : 12,
        rotate: isMobile ? 45 : 0,
        interval: isMobile ? 'auto' : 0
      }
    },
    yAxis: [
      {
        type: "value",
        name: isMobile ? "" : "Total Fans",
        nameTextStyle: {
          color: "#94a3b8", // slate-400
          fontSize: isMobile ? 10 : 12
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.05)"
          }
        },
        axisLabel: {
          color: "#94a3b8", // slate-400
          fontSize: isMobile ? 9 : 12,
          formatter: (value: number) => {
            if (isMobile && value >= 1000) {
              return (value / 1000).toFixed(0) + 'K'
            }
            return value.toString()
          }
        }
      },
      {
        type: "value",
        name: isMobile ? "" : "Daily New",
        position: "right",
        alignTicks: true,
        nameTextStyle: {
          color: "#94a3b8", // slate-400
          fontSize: isMobile ? 10 : 12
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: "#94a3b8", // slate-400
          fontSize: isMobile ? 9 : 12,
          formatter: (value: number) => {
            if (isMobile && value >= 1000) {
              return (value / 1000).toFixed(0) + 'K'
            }
            return value.toString()
          }
        }
      }
    ],
    series: [
      {
        name: "Total Fans",
        type: "line",
        smooth: true,
        data: props.chartData.totalFans,
        lineStyle: { width: isMobile ? 2 : 3, color: "#3b82f6" }, // blue-500
        itemStyle: { color: "#3b82f6" },
        showSymbol: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.0)" }
          ])
        }
      },
      {
        name: "Daily New Fans",
        type: "bar",
        yAxisIndex: 1,
        data: props.chartData.dailyNewFans,
        itemStyle: {
          color: "#a855f7", // purple-500
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: isMobile ? '60%' : '70%'
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
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
}
</style>



