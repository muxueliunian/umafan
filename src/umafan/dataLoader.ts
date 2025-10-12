/**
 * 原始粉丝记录数据结构
 * 从 JSON 文件中读取的单个玩家的粉丝数据
 */
interface FanRecordRaw {
  name?: string           // 玩家名称
  fan: number             // 粉丝数量
  circle_name?: string    // 公会名称
  ts: string              // 时间戳
  viewer_id: number       // 玩家唯一 ID
  comment?: string        // 备注信息
  rank_score?: number     // 排名分数
  circle_id: number       // 公会 ID
}

/**
 * 公会选项
 * 用于下拉选择器等 UI 组件
 */
export interface CircleOption {
  id: number      // 公会 ID
  name: string    // 公会名称
}

/**
 * Uma 数据加载器的配置选项
 * 包含所有可用的公会和日期
 */
export interface UmaOptions {
  directory: string         // 数据目录路径
  circles: CircleOption[]   // 所有可用的公会列表
  dates: string[]           // 所有可用的日期列表（按时间排序）
}

/**
 * 玩家成长数据
 * 用于表格展示单个玩家在时间段内的粉丝增长情况
 */
export interface PlayerGrowth {
  playerId: string    // 玩家 ID
  name: string        // 玩家名称
  startFans: number   // 起始粉丝数
  endFans: number     // 结束粉丝数
  increase: number    // 粉丝增长量
  comment: string     // 备注信息
}

/**
 * Uma 公会概览数据
 * 包含指定公会在指定时间段内的完整统计信息
 */
export interface UmaOverview {
  circle: CircleOption                        // 公会信息
  range: { start: string; end: string }       // 时间范围
  metrics: {                                  // 统计指标
    fansTotalGrowth: number                   // 总粉丝增长量
    todayNewFans: number                      // 今日新增粉丝
    activityStatus: string                    // 活跃状态
    activityNote: string                      // 活跃备注
  }
  chart: {                                    // 图表数据
    dates: string[]                           // 日期列表
    totalFans: number[]                       // 每日总粉丝数
    dailyNewFans: number[]                    // 每日新增粉丝数
  }
  table: PlayerGrowth[]                       // 玩家成长表格数据
}

// 使用 Vite 的 glob 导入功能，动态加载所有 JSON 数据文件
const dataModules = import.meta.glob("./data/*.json", { eager: true, import: "default" }) as Record<string, Record<string, FanRecordRaw>>
// 日期格式正则：匹配 8 位数字的日期，如 20231012.json
const DATE_PATTERN = /(\d{8})\.json$/

// 按日期组织的数据：key = 日期字符串（如 "20231012"），value = 该日期的所有玩家记录
const dataByDate = new Map<string, Record<string, FanRecordRaw>>()
// 公会映射表：key = 公会 ID，value = 公会名称
const circleMap = new Map<number, string>()

// 初始化：遍历所有导入的数据文件
for (const [path, records] of Object.entries(dataModules)) {
  // 从文件路径中提取日期
  const match = path.match(DATE_PATTERN)
  if (!match) continue
  const date = match[1] ?? ""
  if (!date) continue

  // 存储该日期的数据
  dataByDate.set(date, records)

  // 收集所有公会信息（去重）
  Object.values(records).forEach((record) => {
    const circleId = record.circle_id
    if (!circleMap.has(circleId)) {
      circleMap.set(circleId, record.circle_name ?? `Circle ${circleId}`)
    }
  })
}

// 将日期排序（升序）
const sortedDates = Array.from(dataByDate.keys()).sort()
// 将公会列表按名称排序（中文排序）
const circleOptions: CircleOption[] = Array.from(circleMap.entries())
  .sort((a, b) => a[1].localeCompare(b[1], "zh-CN"))
  .map(([id, name]) => ({ id, name }))

/**
 * 获取 Uma 数据的所有可用选项
 * @returns 包含所有公会和日期的配置对象
 */
export function getUmaOptions(): UmaOptions {
  return {
    directory: "static://umafan-data",
    circles: [...circleOptions],
    dates: [...sortedDates]
  }
}

/**
 * 获取指定公会在指定时间范围内的概览数据
 * @param circleId - 公会 ID
 * @param start - 起始日期（格式：YYYYMMDD）
 * @param end - 结束日期（格式：YYYYMMDD）
 * @returns 公会概览数据，包含统计指标、图表数据和玩家成长表格
 */
export function getUmaOverview(circleId: number, start: string, end: string): UmaOverview {
  // 验证数据完整性
  if (!circleOptions.length) {
    throw new Error("Static dataset contains no circle information")
  }
  if (!sortedDates.length) {
    throw new Error("Static dataset contains no date records")
  }

  // 规范化日期范围：如果输入无效，使用默认的首尾日期
  const defaultStart = sortedDates[0]!
  const defaultEnd = sortedDates[sortedDates.length - 1]!
  const normalizedStart = start && sortedDates.includes(start) ? start : defaultStart
  const normalizedEnd = end && sortedDates.includes(end) ? end : defaultEnd
  // 确保起始日期 <= 结束日期，如果顺序错误则交换
  const [rangeStart, rangeEnd] = normalizedStart <= normalizedEnd
    ? [normalizedStart, normalizedEnd]
    : [normalizedEnd, normalizedStart]

  // 按日期收集指定公会的所有玩家记录
  const recordsByDate = new Map<string, Map<string, FanRecordRaw>>()
  let circleName: string | undefined = circleMap.get(circleId)

  for (const date of sortedDates) {
    // 跳过不在范围内的日期
    if (date < rangeStart || date > rangeEnd) continue
    const rawRecords = dataByDate.get(date)
    if (!rawRecords) continue

    // 筛选出属于指定公会的玩家记录
    const filteredEntries = Object.values(rawRecords)
      .filter((record) => record.circle_id === circleId)
      .map((record) => [record.viewer_id.toString(), record] as const)

    if (!filteredEntries.length) continue
    recordsByDate.set(date, new Map(filteredEntries))

    // 如果还没有公会名称，从记录中获取
    if (!circleName) {
      const firstRecord = filteredEntries[0]?.[1]
      if (firstRecord) {
        circleName = firstRecord.circle_name ?? `Circle ${circleId}`
      }
    }
  }

  // 如果没有找到任何记录，抛出错误
  if (!recordsByDate.size) {
    throw new Error("No records found for the selected circle within the chosen range")
  }

  // 构建各类数据
  const timelines = buildTimelines(recordsByDate)           // 构建玩家时间线
  const table = buildTable(timelines)                       // 构建表格数据
  const totalIncrease = table.reduce((sum, row) => sum + row.increase, 0)  // 计算总增长
  const chart = buildChartData(timelines, recordsByDate)    // 构建图表数据

  // 计算今日新增粉丝数
  let todayNewFans = 0
  if (chart.totalFans.length) {
    if (chart.totalFans.length === 1) {
      // 如果只有一天的数据，今日新增 = 总增长
      todayNewFans = totalIncrease
    } else {
      // 否则，今日新增 = 最后一天的总数 - 倒数第二天的总数
      const size = chart.totalFans.length
      const lastTotal = chart.totalFans[size - 1] ?? 0
      const previousTotal = chart.totalFans[size - 2] ?? lastTotal
      todayNewFans = lastTotal - previousTotal
    }
  }

  // 获取或构造公会选项
  const circleOption = circleOptions.find((option) => option.id === circleId) ?? {
    id: circleId,
    name: circleName ?? `Circle ${circleId}`
  }

  // 返回完整的概览数据
  return {
    circle: circleOption,
    range: { start: rangeStart, end: rangeEnd },
    metrics: {
      fansTotalGrowth: totalIncrease,
      todayNewFans,
      activityStatus: "Steady",
      activityNote: "No anomalies detected for this period"
    },
    chart,
    table
  }
}

/**
 * 构建玩家时间线
 * 将按日期分散的记录，整合成按玩家 ID 组织的时间线
 * @param recordsByDate - 按日期组织的玩家记录
 * @returns 按玩家 ID 组织的时间线数据
 */
function buildTimelines(
  recordsByDate: Map<string, Map<string, FanRecordRaw>>
): Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }> {
  const timelines = new Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }>()
  const orderedDates = Array.from(recordsByDate.keys()).sort()

  // 遍历所有日期，构建每个玩家的历史记录
  for (const date of orderedDates) {
    const recordMap = recordsByDate.get(date)
    if (!recordMap) continue

    recordMap.forEach((record, playerId) => {
      // 获取或创建该玩家的时间线
      const timeline = timelines.get(playerId) ?? { history: [] as { date: string; fans: number }[] }
      // 更新玩家信息（使用最新的非空值）
      timeline.name = record.name ?? timeline.name
      timeline.comment = record.comment ?? timeline.comment
      // 添加该日期的粉丝数记录
      timeline.history.push({ date, fans: record.fan })
      timelines.set(playerId, timeline)
    })
  }

  return timelines
}

/**
 * 构建玩家成长表格
 * 计算每个玩家在时间段内的粉丝增长情况
 * @param timelines - 玩家时间线数据
 * @returns 按粉丝增长量降序排列的玩家列表
 */
function buildTable(
  timelines: Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }>
): PlayerGrowth[] {
  const rows: PlayerGrowth[] = []

  timelines.forEach((timeline, playerId) => {
    const history = timeline.history
    if (!history.length) return

    // 获取首尾记录
    const firstEntry = history[0]
    const lastEntry = history[history.length - 1]
    if (!firstEntry || !lastEntry) return

    // 计算增长量（确保不为负数）
    const startFans = firstEntry.fans
    const endFans = lastEntry.fans
    const increase = Math.max(0, endFans - startFans)

    rows.push({
      playerId,
      name: timeline.name ?? "-",
      startFans,
      endFans,
      increase,
      comment: timeline.comment ?? "-"
    })
  })

  // 按增长量降序排序
  return rows.sort((a, b) => b.increase - a.increase)
}

/**
 * 构建图表数据
 * 生成每日总粉丝数和每日新增粉丝数的数组
 * @param timelines - 玩家时间线数据
 * @param recordsByDate - 按日期组织的记录（用于获取日期列表）
 * @returns 包含日期、总粉丝数、每日新增粉丝数的对象
 */
function buildChartData(
  timelines: Map<string, { history: { date: string; fans: number }[] }>,
  recordsByDate: Map<string, Map<string, FanRecordRaw>>
) {
  const dates = Array.from(recordsByDate.keys()).sort()
  const totalFans: number[] = []
  const dailyNewFans: number[] = []

  // 遍历每一天，计算当天的总粉丝数
  for (const date of dates) {
    let sum = 0
    // 累加所有玩家在该日期或之前的最新粉丝数
    timelines.forEach((timeline) => {
      const fans = fansAtOrBefore(timeline.history, date)
      if (fans != null) {
        sum += fans
      }
    })

    totalFans.push(sum)
    // 计算当日新增 = 当日总数 - 前一日总数
    const previous = totalFans.length > 1 ? totalFans[totalFans.length - 2] ?? sum : sum
    dailyNewFans.push(sum - previous)
  }

  return {
    dates,
    totalFans,
    dailyNewFans
  }
}

/**
 * 获取玩家在指定日期或之前的最新粉丝数
 * @param entries - 玩家的历史记录
 * @param targetDate - 目标日期
 * @returns 最新的粉丝数，如果没有记录则返回 null
 */
function fansAtOrBefore(entries: { date: string; fans: number }[], targetDate: string): number | null {
  let result: number | undefined
  // 遍历历史记录，找到最接近但不晚于目标日期的记录
  for (const entry of entries) {
    if (entry.date > targetDate) break
    result = entry.fans
  }
  return result ?? null
}








