import { fetchWithToken } from '../utils/fetch'
import { formatFriend, formatPost } from '../utils/format'
import { isSpecificJSONFormat } from '../utils'
import type { Friend, Gist, Issue, IssueComment, IssueLabel, IssueResponse, IssueSearchResponse, Notice, Tag } from '../types/index'
import { createNotify } from '../services/notifyService'

const tempGistToken: string = import.meta.env.V_GITHUB_GIST_TOKEN
const GIST_TOKEN = tempGistToken?.split(', ')?.join('')

// const isDev = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|127\.0\.0\.1|localhost)/.test(window.location.host)
const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
const GIST_ID: string = import.meta.env.V_GIST_ID || ''
if (!USERNAME || !REPO) {
  createNotify({
    message: 'V_USERNAME 和 V_REPOSITORY 没有配置',
    type: 'error',
    duration: 6000,
  })
  throw new Error('V_USERNAME, V_REPOSITORY must be set')
}

// API 链接拼接
const GITHUB_GRAPHQL = 'https://api.github.com/graphql'
const BLOG_PREFIX = `/repos/${USERNAME}/${REPO}`
const FR_PREFIX = `/repos/${USERNAME}/${FR_REPO}`
const GIST_PREFIX = '/gists'

/**
 * 执行 GraphQL 查询
 * @param params 查询参数
 * @param params.query 查询语句
 * @returns 查询结果
 */
async function fetchByGraphQL<T>({ query = '' }: { query: string }): Promise<T | undefined> {
  const res = await fetchWithToken<{ data: T }>(GITHUB_GRAPHQL, {
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
  })
  return res?.data
}

/**
 * 获取博客数量
 * @returns 博客数量
 */
export async function getPostsCount() {
  const res = await fetchByGraphQL({
    query: `query {
      repository(owner: "${USERNAME}", name: "${REPO}") {
        count: issues { totalCount }
      }
    }`,
  }) as { repository: { count: { totalCount: number } } }
  return res?.repository?.count?.totalCount || 0
}

/**
 * 获取友链数量
 * @returns 友链数量
 */
export async function getFriendsCount() {
  const res = await fetchByGraphQL({
    query: `query {
      repository(owner: "${USERNAME}", name: "${FR_REPO}") {
        count: issues { totalCount }
      }
    }`,
  }) as { repository: { count: { totalCount: number } } }
  return res?.repository?.count?.totalCount || 0
}

export async function getFriendsCountByComments() {
  const res = await fetchByGraphQL({
    query: `query {
      repository(owner: "${USERNAME}", name: "${REPO}") {
        issues(labels: ["Friend"], first: 1) {
          nodes {
            title
            comments { totalCount }
          }
        }
      }
    }`,
  }) as { repository: { issues: { nodes: { comments: { totalCount: number } }[] } } }
  return res?.repository?.issues?.nodes?.[0]?.comments?.totalCount || 0
}

/**
 * 获取博客列表
 * @param params 查询参数
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @returns 博客列表
 */

/*
 * 获取博客列表
 * */
export async function getPosts({ page = 1, pageSize }: { page?: number, pageSize?: number }) {
  if (!pageSize)
    pageSize = await getPostsCount()
  const res = await fetchWithToken<IssueResponse>(`${BLOG_PREFIX}/issues?state=open&page=${page}&per_page=${pageSize}`)
  return res?.map(formatPost) || []
}

/*
 * 获取友链列表
 * */
export async function getFriends({ page = 1, pageSize }: { page?: number, pageSize?: number }) {
  if (!pageSize)
    pageSize = await getFriendsCount()
  const res = await fetchWithToken<IssueResponse>(`${FR_PREFIX}/issues?state=closed&page=${page}&per_page=${pageSize}&direction=asc`)
  return res?.map(formatFriend) || []
}

interface CommentNode { body: string }
interface IssueNode { comments: { nodes: CommentNode[] } }
export async function getFriendsByComments() {
  const friendCount = await getFriendsCountByComments()
  const response = await fetchByGraphQL({
    query: `query() {
      repository(owner: "${USERNAME}", name: "${REPO}") {
        issues(labels: ["Friend"], states: CLOSED, first: 1) {
          nodes {
            comments(first: ${friendCount}) {
              nodes { body }
            }
          }
        }
      }
    }`,
  }) as { repository: { issues: { nodes: IssueNode[] } } }
  const friendRes = response?.repository?.issues?.nodes?.[0]?.comments?.nodes || []
  const friends: Friend[] = []
  if (!friendRes?.length)
    return friends
  friendRes.forEach((fr: CommentNode) => {
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
export async function searchPosts({ keyword = '', page = 1, pageSize }: { keyword?: string, page?: number, pageSize?: number }) {
  if (!pageSize)
    pageSize = await getPostsCount()
  const res = await fetchWithToken<IssueSearchResponse>(`/search/issues?q=${keyword}+repo:${USERNAME}/${REPO}+type:issue+state:open&page=${page}&per_page=${pageSize}`)
  const posts = res?.items?.map(formatPost) || []
  return {
    total_count: res?.total_count || 0,
    posts,
  }
}

/*
 * 获取博客详情
 * */
export async function getPost({ number = 0 }) {
  const res = await fetchWithToken<Issue>(`${BLOG_PREFIX}/issues/${number}?state=open`)
  return res ? formatPost(res) : null
}

/*
 * 获取博客评论
 * */
export async function getComments({ url = '' }) {
  const res = await fetchWithToken<IssueComment[]>(`${url}`)
  return res || []
}

/*
 * 获取文章标签
 * */
export async function getTags() {
  const filterLabel = ['Notice', 'Inspiration', 'Friend', 'Book', 'About', 'Counter']
  const res = await fetchWithToken<IssueLabel[]>(`${BLOG_PREFIX}/labels?page=1&per_page=1000`)
  const resFilter = res?.filter(item => !filterLabel.includes(item.name)) || []
  const tags: Tag[] = resFilter.map(item => ({
    id: item.id,
    name: item.name,
    count: 0,
  }))

  return tags
}

/*
 * 获取关于页面
 * */
export async function getAbout() {
  const res = await fetchWithToken<IssueResponse>(`${BLOG_PREFIX}/issues?state=closed&labels=About`)
  return res?.[0].body
}

/*
 * 获取通知
 * */
export async function getNotice() {
  const res = await fetchWithToken<IssueResponse>(`${BLOG_PREFIX}/issues?state=closed&labels=Notice`)
  const notice: Notice = {
    content: res?.[0].body || '',
    color: `#${res?.[0].labels[0].color}`,
  }
  return notice
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
  const res = await fetchWithToken<Gist>(`${GIST_PREFIX}/${GIST_ID}`, {
    method,
    headers: {
      Authorization: `Bearer ${GIST_TOKEN}`,
    },
    body,
  })
  const data = res?.files || {}
  return data
}

/**
 * 获取 IP
 * 先请求 IPv4 地址，如果没有就请求 https://api.ip.sb/geoip
 * @returns IP 地址
 */
async function getAutoIp(): Promise<string> {
  const response = await fetch('https://api.ip.sb/geoip')
  if (response.ok) {
    const info = await response.json()
    if (info?.ip)
      return info.ip
  }
  return '未知'
}
export async function getIP(): Promise<string> {
  try {
    const res = await fetch('https://api-ipv4.ip.sb/ip')
    const ip = await res.text()
    if (ip)
      return ip
    else
      return await getAutoIp()
  }
  catch (error) {
    return await getAutoIp()
  }
}
