export interface CounterData {
  id: number
  title: string
  times: number
  site: string
  createdAt?: string
  updatedAt?: string
}

export interface VisitorLog {
  ua: string
  ip: string
  id: string
  visitedTimes: number
  firstVisitedAt: string
  lastVisitedAt: string
}

export interface VisitorRecord {
  referrer: string
  totalVisitTimes: number
  uvCount: number
  visitors: VisitorLog[]
  createdAt?: string
  updatedAt?: string
}

type StatisticsData = CounterData[] | VisitorRecord[]
interface GistFileContent {
  content?: string
  truncated?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0
}

function isISODate(value: unknown): value is string {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
    && !Number.isNaN(Date.parse(value))
}

function hasValidOptionalDates(value: Record<string, unknown>) {
  return (value.createdAt === undefined || isISODate(value.createdAt))
    && (value.updatedAt === undefined || isISODate(value.updatedAt))
}

export function isCounterData(value: unknown): value is CounterData[] {
  return Array.isArray(value) && value.every(item => isRecord(item)
    && isNonNegativeInteger(item.id)
    && typeof item.title === 'string'
    && isNonNegativeInteger(item.times)
    && typeof item.site === 'string'
    && hasValidOptionalDates(item))
}

function isVisitorLog(value: unknown): value is VisitorLog {
  return isRecord(value)
    && typeof value.ua === 'string'
    && typeof value.ip === 'string'
    && typeof value.id === 'string'
    && isNonNegativeInteger(value.visitedTimes)
    && isISODate(value.firstVisitedAt)
    && isISODate(value.lastVisitedAt)
}

export function isVisitorData(value: unknown): value is VisitorRecord[] {
  return Array.isArray(value) && value.every(item => isRecord(item)
    && typeof item.referrer === 'string'
    && isNonNegativeInteger(item.totalVisitTimes)
    && isNonNegativeInteger(item.uvCount)
    && Array.isArray(item.visitors)
    && item.visitors.every(isVisitorLog)
    && hasValidOptionalDates(item))
}

export function parseStatisticsFile<T extends StatisticsData>(
  content: unknown,
  validate: (value: unknown) => value is T,
  fileName: string,
): T {
  if (typeof content !== 'string' || content.trim() === '')
    throw new Error(`${fileName} is missing its content`)

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  }
  catch {
    throw new Error(`${fileName} contains invalid or truncated JSON`)
  }

  if (!validate(parsed))
    throw new Error(`${fileName} has an invalid data structure`)

  return parsed
}

export function parseGistStatisticsFile<T extends StatisticsData>(
  file: GistFileContent | undefined,
  validate: (value: unknown) => value is T,
  fileName: string,
): T {
  if (!file)
    throw new Error(`Gist file ${fileName} is missing`)
  if (file.truncated)
    throw new Error(`Gist file ${fileName} is truncated`)
  return parseStatisticsFile(file.content, validate, fileName)
}

export function assertCountersNotRegressed(known: CounterData[], remote: CounterData[]) {
  const remoteById = new Map(remote.map(counter => [counter.id, counter]))
  const regressed = known.some((counter) => {
    const remoteCounter = remoteById.get(counter.id)
    return !remoteCounter || remoteCounter.times < counter.times
  })
  if (regressed)
    throw new Error('counter.json is older than the last confirmed local state')
}

export function assertVisitorsNotRegressed(known: VisitorRecord[], remote: VisitorRecord[]) {
  const remoteByReferrer = new Map(remote.map(visitor => [visitor.referrer, visitor]))
  const regressed = known.some((visitor) => {
    const remoteVisitor = remoteByReferrer.get(visitor.referrer)
    return !remoteVisitor
      || remoteVisitor.totalVisitTimes < visitor.totalVisitTimes
      || remoteVisitor.uvCount < visitor.uvCount
  })
  if (regressed)
    throw new Error('visitor.json is older than the last confirmed local state')
}
