import { fetchWithToken } from '../utils/fetch'
import { formatFriend, formatPost } from '../utils/format'
import { isSpecificJSONFormat } from '../utils'
import type { Friend, Tag } from '../types/index'
import { createNotify } from '../services/notifyService'

const tempGistToken: string = import.meta.env.V_GITHUB_GIST_TOKEN
const GIST_TOKEN = tempGistToken?.split(', ')?.join('')

// const isDev = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|127\.0\.0\.1|localhost)/.test(window.location.host)
const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
const GIST_ID: string = import.meta.env.V_GIST_ID || ''
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

// API 链接拼接
const BLOG_PREFIX = `/repos/${USERNAME}/${REPO}`
const FR_PREFIX = `/repos/${USERNAME}/${FR_REPO}`
const GIST_PREFIX = '/gists'

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
 * 请求 Gist
 * @param method 请求方法（GET 或 PATCH）
 * @param body 请求体（JSON 字符串）
 * @returns Gist 文件内容
 */
export async function requestGist(method: 'GET' | 'PATCH' = 'GET', body?: string) {
  if (!GIST_ID || !GIST_TOKEN)
    return null
  const res = await fetchWithToken(`${GIST_PREFIX}/${GIST_ID}`, {
    method,
    headers: {
      Authorization: `Bearer ${GIST_TOKEN}`,
    },
    body,
  })
  const data = res?.files || {}
  return data
}
