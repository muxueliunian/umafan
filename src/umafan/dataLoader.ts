interface FanRecordRaw {
  name?: string
  fan: number
  circle_name?: string
  ts: string
  viewer_id: number
  comment?: string
  rank_score?: number
  circle_id: number
}

export interface CircleOption {
  id: number
  name: string
}

export interface UmaOptions {
  directory: string
  circles: CircleOption[]
  dates: string[]
}

export interface PlayerGrowth {
  playerId: string
  name: string
  startFans: number
  endFans: number
  increase: number
  comment: string
}

export interface UmaOverview {
  circle: CircleOption
  range: { start: string; end: string }
  metrics: {
    fansTotalGrowth: number
    todayNewFans: number
    activityStatus: string
    activityNote: string
  }
  chart: {
    dates: string[]
    totalFans: number[]
    dailyNewFans: number[]
  }
  table: PlayerGrowth[]
}

const dataModules = import.meta.glob("./data/*.json", { eager: true, import: "default" }) as Record<string, Record<string, FanRecordRaw>>
const DATE_PATTERN = /(\d{8})\.json$/

const dataByDate = new Map<string, Record<string, FanRecordRaw>>()
const circleMap = new Map<number, string>()

for (const [path, records] of Object.entries(dataModules)) {
  const match = path.match(DATE_PATTERN)
  if (!match) continue
  const date = match[1] ?? ""
  if (!date) continue
  dataByDate.set(date, records)
  Object.values(records).forEach((record) => {
    const circleId = record.circle_id
    if (!circleMap.has(circleId)) {
      circleMap.set(circleId, record.circle_name ?? `Circle ${circleId}`)
    }
  })
}

const sortedDates = Array.from(dataByDate.keys()).sort()
const circleOptions: CircleOption[] = Array.from(circleMap.entries())
  .sort((a, b) => a[1].localeCompare(b[1], "zh-CN"))
  .map(([id, name]) => ({ id, name }))

export function getUmaOptions(): UmaOptions {
  return {
    directory: "static://umafan-data",
    circles: [...circleOptions],
    dates: [...sortedDates]
  }
}

export function getUmaOverview(circleId: number, start: string, end: string): UmaOverview {
  if (!circleOptions.length) {
    throw new Error("Static dataset contains no circle information")
  }
  if (!sortedDates.length) {
    throw new Error("Static dataset contains no date records")
  }

  const defaultStart = sortedDates[0]!
  const defaultEnd = sortedDates[sortedDates.length - 1]!
  const normalizedStart = start && sortedDates.includes(start) ? start : defaultStart
  const normalizedEnd = end && sortedDates.includes(end) ? end : defaultEnd
  const [rangeStart, rangeEnd] = normalizedStart <= normalizedEnd
    ? [normalizedStart, normalizedEnd]
    : [normalizedEnd, normalizedStart]

  const recordsByDate = new Map<string, Map<string, FanRecordRaw>>()
  let circleName: string | undefined = circleMap.get(circleId)

  for (const date of sortedDates) {
    if (date < rangeStart || date > rangeEnd) continue
    const rawRecords = dataByDate.get(date)
    if (!rawRecords) continue

    const filteredEntries = Object.values(rawRecords)
      .filter((record) => record.circle_id === circleId)
      .map((record) => [record.viewer_id.toString(), record] as const)

    if (!filteredEntries.length) continue
    recordsByDate.set(date, new Map(filteredEntries))

    if (!circleName) {
      const firstRecord = filteredEntries[0]?.[1]
      if (firstRecord) {
        circleName = firstRecord.circle_name ?? `Circle ${circleId}`
      }
    }
  }

  if (!recordsByDate.size) {
    throw new Error("No records found for the selected circle within the chosen range")
  }

  const timelines = buildTimelines(recordsByDate)
  const table = buildTable(timelines)
  const totalIncrease = table.reduce((sum, row) => sum + row.increase, 0)
  const chart = buildChartData(timelines, recordsByDate)

  let todayNewFans = 0
  if (chart.totalFans.length) {
    if (chart.totalFans.length === 1) {
      todayNewFans = totalIncrease
    } else {
      const size = chart.totalFans.length
      const lastTotal = chart.totalFans[size - 1] ?? 0
      const previousTotal = chart.totalFans[size - 2] ?? lastTotal
      todayNewFans = lastTotal - previousTotal
    }
  }

  const circleOption = circleOptions.find((option) => option.id === circleId) ?? {
    id: circleId,
    name: circleName ?? `Circle ${circleId}`
  }

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

function buildTimelines(
  recordsByDate: Map<string, Map<string, FanRecordRaw>>
): Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }> {
  const timelines = new Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }>()
  const orderedDates = Array.from(recordsByDate.keys()).sort()

  for (const date of orderedDates) {
    const recordMap = recordsByDate.get(date)
    if (!recordMap) continue

    recordMap.forEach((record, playerId) => {
      const timeline = timelines.get(playerId) ?? { history: [] as { date: string; fans: number }[] }
      timeline.name = record.name ?? timeline.name
      timeline.comment = record.comment ?? timeline.comment
      timeline.history.push({ date, fans: record.fan })
      timelines.set(playerId, timeline)
    })
  }

  return timelines
}

function buildTable(
  timelines: Map<string, { name?: string; comment?: string; history: { date: string; fans: number }[] }>
): PlayerGrowth[] {
  const rows: PlayerGrowth[] = []

  timelines.forEach((timeline, playerId) => {
    const history = timeline.history
    if (!history.length) return

    const firstEntry = history[0]
    const lastEntry = history[history.length - 1]
    if (!firstEntry || !lastEntry) return

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

  return rows.sort((a, b) => b.increase - a.increase)
}

function buildChartData(
  timelines: Map<string, { history: { date: string; fans: number }[] }>,
  recordsByDate: Map<string, Map<string, FanRecordRaw>>
) {
  const dates = Array.from(recordsByDate.keys()).sort()
  const totalFans: number[] = []
  const dailyNewFans: number[] = []

  for (const date of dates) {
    let sum = 0
    timelines.forEach((timeline) => {
      const fans = fansAtOrBefore(timeline.history, date)
      if (fans != null) {
        sum += fans
      }
    })

    totalFans.push(sum)
    const previous = totalFans.length > 1 ? totalFans[totalFans.length - 2] ?? sum : sum
    dailyNewFans.push(sum - previous)
  }

  return {
    dates,
    totalFans,
    dailyNewFans
  }
}

function fansAtOrBefore(entries: { date: string; fans: number }[], targetDate: string): number | null {
  let result: number | undefined
  for (const entry of entries) {
    if (entry.date > targetDate) break
    result = entry.fans
  }
  return result ?? null
}








