import AV from 'leancloud-storage'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { fetchWithToken } from '../utils/fetch'
import { formatFriend, formatPost } from '../utils/format'
import { isSpecificJSONFormat, isValidJSON } from '../utils'
import type { Friend, Post, Tag } from '../types/index'
import { createNotify } from '../services/notifyService'

// const isDev = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|127\.0\.0\.1|localhost)/.test(window.location.host)
const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
const BLOG_PER_PAGE = import.meta.env.V_BLOG_COUNT || 100
const FRIEND_PER_PAGE = import.meta.env.V_FRIEND_COUNT || 100
if (!USERNAME || !REPO) {
  createNotify({
    message: 'V_USERNAME 和 V_REPOSITORY 没有配置',
    type: 'error',
    duration: 6000,
  })
  throw new Error('V_USERNAME, V_REPOSITORY must be set')
}

// 定义 Counter 数据模型接口（类型安全）
interface CounterData {
  id: number
  title: string
  times: number
  site: string
  createdAt?: string
  updatedAt?: string
}
// 类型定义（类型安全核心）
interface VisitorLog {
  ua: string
  ip: string
  id: string
  time: string
}

interface VisitorRecord {
  referrer: string
  times: number
  visitors: VisitorLog[]
  createdAt?: Date
  updatedAt?: Date
}

type VisitorObject = AV.Object & {
  get: (key: keyof VisitorRecord) => VisitorRecord[keyof VisitorRecord] | undefined
  set: (key: keyof VisitorRecord, value: VisitorRecord[keyof VisitorRecord]) => void
  increment: (key: 'times', amount: number) => void
}

// 常量定义（避免硬编码）
const READ_COUNT_INCREMENT = 1 // 阅读量递增步长
const VISITOR_CLASS_NAME = 'Visitor'
const VISIT_COUNT_INCREMENT = 1

// API 链接拼接
const BLOG_PREFIX = `/repos/${USERNAME}/${REPO}`
const FR_PREFIX = `/repos/${USERNAME}/${FR_REPO}`

/*
 * 获取博客列表
 * */
export async function getPosts({ page = 1, pageSize = BLOG_PER_PAGE }) {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=open&page=${page}&per_page=${pageSize}`)
  return res.map(formatPost)
}

/*
 * 获取友链列表
 * */
export async function getFriends({ page = 1, pageSize = FRIEND_PER_PAGE }) {
  const res = await fetchWithToken(`${FR_PREFIX}/issues?state=closed&page=${page}&per_page=${pageSize}&direction=asc`)
  return res.map(formatFriend)
}

interface Fr {
  body: string
}
export async function getFriendsByComments() {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=closed&labels=Friend`)
  if (!res?.length)
    return []
  const commentsUrl = res[0].comments_url
  const friendRes = await fetchWithToken(`${commentsUrl}?page=1&per_page=${FRIEND_PER_PAGE}`)
  const friends: Friend[] = []
  friendRes.forEach((fr: Fr) => {
    if (isSpecificJSONFormat(fr.body)) {
      const friend = JSON.parse(fr.body)
      friends.push(friend)
    }
  })
  return friends
}

/*
 * 搜索
 * */
export async function searchPosts({ keyword = '', page = 1, pageSize = BLOG_PER_PAGE }) {
  const res = await fetchWithToken(`/search/issues?q=${keyword}+repo:${USERNAME}/${REPO}+type:issue+state:open&page=${page}&per_page=${pageSize}`)
  const posts = res?.items.map(formatPost)
  return {
    total_count: res?.total_count,
    posts,
  }
}

/*
 * 获取博客详情
 * */
export async function getPost({ number = 0 }) {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues/${number}?state=open`)
  return formatPost(res)
}

/*
 * 获取博客评论
 * */
export async function getComments({ url = '' }) {
  const res = await fetchWithToken(url)
  return res
}

/*
 * 获取文章标签
 * */
export async function getTags() {
  const filterLabel = ['Notice', 'Inspiration', 'Friend', 'Book', 'About', 'Counter']
  const res: Tag[] = await fetchWithToken(`${BLOG_PREFIX}/labels?page=1&per_page=1000`)
  const resFilter = res.filter(item => !filterLabel.includes(item.name))
  const tags = resFilter.map(item => ({
    id: item.id,
    name: item.name,
    count: item.count || 0,
  }))

  return tags
}

/*
 * 获取关于页面
 * */
export async function getAbout() {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=closed&labels=About`)
  return res?.[0].body
}

/*
 * 获取通知
 * */
export async function getNotice() {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=closed&labels=Notice`)
  return {
    content: res?.[0].body,
    color: `#${res?.[0].labels[0].color}`,
  }
}

/**
 * 获取或设置文章阅读量
 * @param post 文章信息（需包含 id 和 title num）
 * @param needSet 是否需要修改
 * @returns 保存后的 Counter 实例或 null
 */
export async function setCounter(post?: Post, needSet: boolean = false) {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=closed&labels=Counter`)
  const data = res?.[0].body || []
  let counters: CounterData[] = []
  if (isValidJSON(data).isValid)
    counters = isValidJSON(data).parsedData
  if (!needSet)
    return counters // 提前返回，后面不执行
  if (post) {
    // 开发环境直接返回
    if (import.meta.env.DEV)
      return counters
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
    await fetchWithToken(res?.[0].url, {
      method: 'PATCH',
      body: JSON.stringify({
        body: JSON.stringify(counters),
      }),
    })
  }
  return counters
}

/**
 * 记录访问来源（优化点：原子操作、异步容错、类型约束、性能提升）
 * @param params 访问参数
 * @param params.referrer 访问来源（默认空字符串）
 * @param params.ua 用户代理（默认空字符串）
 * @param params.ip IP地址（默认空字符串）
 * @returns 保存后的 Visitor 实例或 null
 */
export async function recordVisit({
  referrer = '',
  ua = '',
  ip = '',
}: {
  referrer?: string
  ua?: string
  ip?: string
}): Promise<VisitorObject | null> {
  // 开发环境直接返回
  if (import.meta.env.DEV)
    return null

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
    ua: ua.trim(),
    ip: ip.trim(),
    id: visitorId || '',
    time: new Date().toISOString(),
  }

  // 查询条件：按 referrer 匹配（忽略空字符串首尾空格）
  const normalizedReferrer = referrer.trim()
  const VisitorClass = AV.Object.extend(VISITOR_CLASS_NAME)

  try {
    const query = new AV.Query(VISITOR_CLASS_NAME) as AV.Query<VisitorObject>
    query.equalTo('referrer', normalizedReferrer)
    query.limit(1) // 仅查询1条（性能优化）

    // 容错处理：查询失败时返回 null（避免中断流程）
    const existingVisitor = await query.first().catch((queryErr) => {
      console.error('recordVisit: 查询访问记录失败', queryErr)
      return null
    })

    if (existingVisitor) {
      // 🔥 核心优化：原子操作 + 数组操作（避免并发问题）
      existingVisitor.increment('times', VISIT_COUNT_INCREMENT) // 原子递增总次数

      // LeanCloud 数组添加优化：使用 add 方法（支持原子操作，避免覆盖）
      existingVisitor.add('visitors', visitLog)

      return await existingVisitor.save(null, {
        fetchWhenSave: true, // 保存后返回最新数据
      })
    }
    else {
      // 新建访问记录（类型约束，避免字段遗漏）
      const newVisitor = new VisitorClass() as VisitorObject
      newVisitor.set('referrer', normalizedReferrer)
      newVisitor.set('times', VISIT_COUNT_INCREMENT)
      newVisitor.set('visitors', [visitLog]) // 初始化日志数组

      return await newVisitor.save()
    }
  }
  catch (error) {
    // 错误分级处理（便于调试）
    if (error instanceof AV.Error) {
      console.error(
        `recordVisit: LeanCloud 错误 [${error.code}]:`,
        error.message,
        '访问来源:',
        normalizedReferrer,
      )
    }
    else {
      console.error('recordVisit: 未知错误', error, '访问来源:', normalizedReferrer)
    }
    return null
  }
}
