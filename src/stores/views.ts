import { defineStore } from 'pinia'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { ref } from 'vue'
import { requestGist } from '../api'
import type { Post } from '../types/index'
import {
  assertCountersNotRegressed,
  assertVisitorsNotRegressed,
  isCounterData,
  isVisitorData,
  parseGistStatisticsFile,
} from './viewsData'
import type { CounterData, VisitorLog, VisitorRecord } from './viewsData'

const READ_COUNT_INCREMENT = 1
const VISIT_COUNT_INCREMENT = 1

type StatisticsFile = 'counter' | 'visitor'
interface StatisticsData {
  counter: CounterData[]
  visitor: VisitorRecord[]
}

const memoryQueues = new Map<StatisticsFile, Promise<void>>()

async function withMemoryLock<T>(file: StatisticsFile, task: () => Promise<T>): Promise<T> {
  const previous = memoryQueues.get(file) ?? Promise.resolve()
  let release = () => {}
  const current = new Promise<void>((resolve) => {
    release = resolve
  })
  memoryQueues.set(file, current)
  await previous
  try {
    return await task()
  }
  finally {
    release()
    if (memoryQueues.get(file) === current)
      memoryQueues.delete(file)
  }
}

async function withStatisticsLock<T>(file: StatisticsFile, task: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks)
    return navigator.locks.request(`plain-gist-${file}`, task)
  return withMemoryLock(file, task)
}

function cloneData<T>(data: T): T {
  return structuredClone(data)
}

export const useViewsStore = defineStore('views', () => {
  const views = ref<StatisticsData>({ counter: [], visitor: [] })
  const confirmed = { counter: false, visitor: false }
  const recordedPosts = new Set<number>()
  const pendingPosts = new Map<number, Promise<void>>()
  let visitorWrite: Promise<void> | null = null

  function readFile(files: Awaited<ReturnType<typeof requestGist>>, file: 'counter'): CounterData[]
  function readFile(files: Awaited<ReturnType<typeof requestGist>>, file: 'visitor'): VisitorRecord[]
  function readFile(files: Awaited<ReturnType<typeof requestGist>>, file: StatisticsFile) {
    const fileName = `${file}.json`
    return file === 'counter'
      ? parseGistStatisticsFile(files[fileName], isCounterData, fileName)
      : parseGistStatisticsFile(files[fileName], isVisitorData, fileName)
  }

  function assertNotRegressed(file: 'counter', remote: CounterData[]): void
  function assertNotRegressed(file: 'visitor', remote: VisitorRecord[]): void
  function assertNotRegressed(file: StatisticsFile, remote: CounterData[] | VisitorRecord[]) {
    if (!confirmed[file])
      return
    if (file === 'counter')
      assertCountersNotRegressed(views.value.counter, remote as CounterData[])
    else
      assertVisitorsNotRegressed(views.value.visitor, remote as VisitorRecord[])
  }

  async function getFile(file: 'counter'): Promise<CounterData[]>
  async function getFile(file: 'visitor'): Promise<VisitorRecord[]>
  async function getFile(file: StatisticsFile) {
    const files = await requestGist('GET')
    if (file === 'counter') {
      const data = readFile(files, 'counter')
      assertNotRegressed('counter', data)
      return data
    }
    const data = readFile(files, 'visitor')
    assertNotRegressed('visitor', data)
    return data
  }

  async function getViews(): Promise<boolean> {
    const files = await requestGist('GET')
    const counters = readFile(files, 'counter')
    const visitors = readFile(files, 'visitor')
    assertNotRegressed('counter', counters)
    assertNotRegressed('visitor', visitors)

    views.value = {
      counter: cloneData(counters),
      visitor: cloneData(visitors),
    }
    confirmed.counter = true
    confirmed.visitor = true
    return true
  }

  async function setViews(file: 'counter', data: CounterData[]): Promise<void>
  async function setViews(file: 'visitor', data: VisitorRecord[]): Promise<void>
  async function setViews(file: StatisticsFile, data: CounterData[] | VisitorRecord[]) {
    const fileName = `${file}.json`
    const content = JSON.stringify(data)
    const files = await requestGist('PATCH', JSON.stringify({
      files: { [fileName]: { content } },
    }))
    const savedData = file === 'counter'
      ? readFile(files, 'counter')
      : readFile(files, 'visitor')

    if (JSON.stringify(savedData) !== content)
      throw new Error(`Gist PATCH response did not confirm ${fileName}`)

    if (file === 'counter')
      views.value.counter = cloneData(savedData as CounterData[])
    else
      views.value.visitor = cloneData(savedData as VisitorRecord[])
    confirmed[file] = true
  }

  async function recordCounter(post: Post) {
    await withStatisticsLock('counter', async () => {
      const counters = cloneData(await getFile('counter'))
      const counterIndex = counters.findIndex(counter => counter.id === post.num)
      const now = new Date().toISOString()

      if (counterIndex === -1) {
        counters.push({
          id: post.num,
          times: 1,
          title: post.title,
          site: window.location.href,
          createdAt: now,
          updatedAt: now,
        })
      }
      else {
        counters[counterIndex] = {
          ...counters[counterIndex],
          times: counters[counterIndex].times + READ_COUNT_INCREMENT,
          updatedAt: now,
        }
      }

      await setViews('counter', counters)
    })
  }

  async function setCounter(post: Post) {
    if (!post || import.meta.env.DEV || recordedPosts.has(post.num))
      return

    const pending = pendingPosts.get(post.num)
    if (pending)
      return pending

    const operation = recordCounter(post)
      .then(() => {
        recordedPosts.add(post.num)
      })
      .finally(() => {
        pendingPosts.delete(post.num)
      })
    pendingPosts.set(post.num, operation)
    return operation
  }

  async function recordVisitor({ referrer, ua, ip }: { referrer: string, ua: string, ip: string }) {
    let visitorId = ''
    try {
      const fp = await FingerprintJS.load({ monitoring: false })
      const result = await fp.get()
      visitorId = result.visitorId
    }
    catch (error) {
      console.error('recordVisit: device fingerprint failed', error)
    }

    await withStatisticsLock('visitor', async () => {
      const visitors = cloneData(await getFile('visitor'))
      const now = new Date().toISOString()
      const visitorIndex = visitors.findIndex(visitor => visitor.referrer === referrer)
      const visitLog: VisitorLog = {
        ua,
        ip,
        id: visitorId,
        visitedTimes: 1,
        firstVisitedAt: now,
        lastVisitedAt: now,
      }

      if (visitorIndex === -1) {
        visitors.push({
          referrer,
          totalVisitTimes: 1,
          uvCount: 1,
          visitors: [visitLog],
          createdAt: now,
          updatedAt: now,
        })
      }
      else {
        const visitor = visitors[visitorIndex]
        const logs = [...visitor.visitors]
        const ipIndex = logs.findIndex(item => item.ip === ip)
        let uvCount = visitor.uvCount
        if (ipIndex === -1) {
          logs.push(visitLog)
          uvCount += VISIT_COUNT_INCREMENT
        }
        else {
          logs[ipIndex] = {
            ...logs[ipIndex],
            visitedTimes: logs[ipIndex].visitedTimes + VISIT_COUNT_INCREMENT,
            lastVisitedAt: now,
          }
        }
        visitors[visitorIndex] = {
          ...visitor,
          totalVisitTimes: visitor.totalVisitTimes + VISIT_COUNT_INCREMENT,
          uvCount,
          visitors: logs,
          updatedAt: now,
        }
      }

      await setViews('visitor', visitors)
    })
  }

  async function setVisitor({
    referrer = '',
    ua = '',
    ip = '',
  }: {
    referrer?: string
    ua?: string
    ip?: string
  }) {
    if (import.meta.env.DEV)
      return
    if (!visitorWrite) {
      visitorWrite = recordVisitor({
        referrer: referrer.trim(),
        ua: ua.trim(),
        ip: ip.trim(),
      })
    }
    return visitorWrite
  }

  return { views, getViews, setCounter, setVisitor }
})
