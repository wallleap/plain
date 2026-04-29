import { defineStore } from 'pinia'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { ref } from 'vue'
import { requestGist } from '../api'
import type { Post } from '../types/index'
import { isValidJSON } from '../utils'

const COUNTER_FILE = 'counter.json'
const VISITOR_FILE = 'visitor.json'

interface CounterData {
  id: number
  title: string
  times: number
  site: string
  createdAt?: string
  updatedAt?: string
}
interface VisitorLog {
  ua: string
  ip: string
  id: string
  visitedTimes: number
  firstVisitedAt: string
  lastVisitedAt: string
}
interface VisitorRecord {
  referrer: string
  totalVisitTimes: number
  uvCount: number
  visitors: VisitorLog[]
  createdAt?: string
  updatedAt?: string
}

// 常量定义（避免硬编码）
const READ_COUNT_INCREMENT = 1 // 阅读量递增步长
const VISIT_COUNT_INCREMENT = 1 // 访问量递增步长

/*
 * ref()s become state properties
 * computed()s become getters
 * function()s become actions
 * */
export const useViewsStore = defineStore('views', () => {
  const views = ref<{
    counter: CounterData[]
    visitor: VisitorRecord[]
  }>({
    counter: [],
    visitor: [],
  })

  async function getViews() {
    const res = await requestGist('GET')
    const counterRes = res?.[COUNTER_FILE]?.content || '[]'
    const visitorRes = res?.[VISITOR_FILE]?.content || '[]'
    if (isValidJSON(counterRes).isValid && isValidJSON(visitorRes).isValid) {
      views.value = {
        counter: isValidJSON(counterRes).parsedData || [],
        visitor: isValidJSON(visitorRes).parsedData || [],
      }
    }
  }

  async function setViews(file: 'counter' | 'visitor', content: string) {
    await requestGist('PATCH', JSON.stringify({
      files: {
        [`${file}.json`]: {
          content,
        },
      },
    }))
    views.value[file] = JSON.parse(content) || []
  }

  async function setCounter(post: Post) {
    if (post) {
      // 开发环境直接返回
      if (import.meta.env.DEV)
        return

      // 从 Gist 获取最新数据
      await getViews()
      const counters = views.value.counter || []

      const counterIndex = counters.findIndex(counter => counter.id === post.num)
      if (counterIndex === -1) {
        counters.push({
          id: post.num,
          times: 1,
          title: post.title,
          site: window.location.href,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      else {
        counters[counterIndex].times += READ_COUNT_INCREMENT
        counters[counterIndex].updatedAt = new Date().toISOString()
      }

      await setViews('counter', JSON.stringify(counters))
      // 刷新本地状态
      views.value.counter = counters
    }
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
    ua = ua.trim()
    ip = ip.trim()
    referrer = referrer.trim()

    // 开发环境直接返回
    if (import.meta.env.DEV)
      return

    // 初始化 FingerprintJS（单独提取，便于错误处理）
    let visitorId: string | null = null
    try {
      const fp = await FingerprintJS.load({
        monitoring: false, // 关闭持续监控（仅单次获取指纹）
      })
      const result = await fp.get()
      visitorId = result.visitorId
    }
    catch (fpError) {
      console.error('recordVisit: 设备指纹获取失败', fpError)
      // 指纹获取失败仍可记录（用空字符串兜底）
      visitorId = ''
    }

    // 构建访问日志（统一格式）
    const visitLog: VisitorLog = {
      ua,
      ip,
      id: visitorId || '',
      visitedTimes: 1,
      firstVisitedAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString(),
    }

    // 查询条件：按 referrer 匹配（忽略空字符串首尾空格）
    const normalizedReferrer = referrer.trim()

    // 从 Gist 获取最新数据
    await getViews()
    const visitors = views.value.visitor || []

    try {
      // 从 visitors 中查询是否存在匹配记录
      const visitorIndex = visitors.findIndex(visitor => visitor.referrer === normalizedReferrer)

      if (visitorIndex === -1) {
        // 新建访问记录
        const newVisitor: VisitorRecord = {
          referrer: normalizedReferrer,
          totalVisitTimes: 1,
          uvCount: 1,
          visitors: [visitLog], // 初始化日志数组
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // 保存新建记录
        visitors.push(newVisitor)
      }
      else {
        // 更新访问记录
        visitors[visitorIndex].totalVisitTimes += VISIT_COUNT_INCREMENT
        visitors[visitorIndex].updatedAt = new Date().toISOString()
        // 判断 IP 是否存在
        const ipIndex = visitors[visitorIndex].visitors.findIndex(item => item.ip === ip)
        if (ipIndex === -1) {
          // IP 不存在，添加到日志数组
          visitLog.visitedTimes = 1
          visitLog.firstVisitedAt = new Date().toISOString()
          visitLog.lastVisitedAt = new Date().toISOString()
          visitLog.id = visitorId || ''
          visitors[visitorIndex].uvCount += VISIT_COUNT_INCREMENT
          visitors[visitorIndex].visitors.push(visitLog)
        }
        else {
          // IP 存在，更新访问次数
          visitors[visitorIndex].visitors[ipIndex].visitedTimes += VISIT_COUNT_INCREMENT
          visitors[visitorIndex].visitors[ipIndex].lastVisitedAt = new Date().toISOString()
        }
      }

      await setViews('visitor', JSON.stringify(visitors))
      views.value.visitor = visitors
    }
    catch (error) {
      console.error('recordVisit: 未知错误', error, '访问来源:', normalizedReferrer)
    }
  }

  return { views, getViews, setViews, setCounter, setVisitor }
})
