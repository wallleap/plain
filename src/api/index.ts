import AV from 'leancloud-storage'
import { fetchWithToken } from '../utils/fetch'
import { formatFriend, formatPost } from '../utils/format'
import type { Friend, Post, Tag } from '../types/index'

const isDev = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|127\.0\.0\.1|localhost)/.test(window.location.host)
const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
const BLOG_PER_PAGE = import.meta.env.V_BLOG_COUNT || 100
const FRIEND_PER_PAGE = import.meta.env.V_FRIEND_COUNT || 100
if (!USERNAME || !REPO)
  throw new Error('V_USERNAME, V_REPOSITORY must be set')

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
  const jsonReg = /\{\r\n\s{2}\"name\":\s\"[^"\n\r]+\",\r\n\s{2}\"url\":\s\"[^"\s\n\r]+\",\r\n\s{2}\"avatar\":\s\"[^"\s\n\r]+\",\r\n\s{2}\"desc\":\s\"[^"\n\r]+\",\r\n\s{2}\"tag\":\s\{\r\n\s{4}\"name\":\s\"[^"\n\r]*\",\r\n\s{4}\"color\":\s\"[^"\n\r]*\",\r\n\s{4}\"bg\":\s\"[^"\n\r]*\"\r\n\s{2}\}\r\n\}/
  const friendRes = await fetchWithToken(`${commentsUrl}?page=1&per_page=${FRIEND_PER_PAGE}`)
  const friends: Friend[] = []
  friendRes.forEach((fr: Fr) => {
    if (jsonReg.test(fr.body))
      friends.push(JSON.parse(fr.body))
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
  const filterLabel = ['Notice', 'Inspiration', 'Friend', 'Book', 'About']
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

/*
 * 设置文章阅读量
 * */
export async function setCounter(post: Post) {
  if (isDev)
    return
  const { title, id } = post
  const CounterObject = AV.Object.extend('Counter')
  const counterObject = new CounterObject()
  try {
    const query = new AV.Query('Counter')
    query.equalTo('id', id)
    const results = await query.find()
    if (results.length > 0) {
      const counter = results[0]
      // counter.increment('times', 1)
      counter.set('times', counter.get('times') + 1)
      return await counter.save()
    }
    else {
      counterObject.set('title', title)
      counterObject.set('times', 1)
      counterObject.set('id', id)
      counterObject.set('site', location.href)
      return await counterObject.save()
    }
  }
  catch (error) {
    console.error('Error occurs at SetCounter,', error)
    return null
  }
}

/*
 * 获取阅读量
 * */
export async function getCounter(ids: number[]) {
  try {
    const query = new AV.Query('Counter')
    query.containedIn('id', ids)
    const results = await query.find()
    if (results.length > 0) {
      const times = {}
      // @ts-expect-error 不需要类型检查
      results.forEach(item => (times[item.attributes.id] = item.attributes.times))
      return times
    }
    else {
      return {}
    }
  }
  catch (error) {
    console.error('Error occurs at getCounter,', error)
    return null
  }
}

/*
 * 记录访问来源
 * */
export async function recordVisit({ referrer = '', ua = '', ip = '' }) {
  if (isDev)
    return
  try {
    const query = new AV.Query('Visitor')
    const VisitorObject = AV.Object.extend('Visitor')
    const visitorObject = new VisitorObject()
    query.equalTo('referrer', referrer)
    const results = await query.first()
    if (results) {
    // results.increment('times', 1)
      results.set('times', results.get('times') + 1)
      return await results.save()
    }
    else {
      visitorObject.set('referrer', referrer)
      visitorObject.set('times', 1)
      visitorObject.set('ua', ua)
      visitorObject.set('ip', ip)
      return await visitorObject.save()
    }
  }
  catch (error) {
    console.error('Error occurs at recordVisit,', error)
    return null
  }
}
