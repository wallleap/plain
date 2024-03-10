import { fetchWithToken } from '../utils/fetch'
import { formatFriend, formatPost } from '../utils/format'
import type { Tag } from '../types/index'

const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
if (!USERNAME || !REPO || !FR_REPO)
  throw new Error('V_USERNAME, V_REPOSITORY, V_FRIENDS_REPO must be set')

// API 链接拼接
const BLOG_PREFIX = `/repos/${USERNAME}/${REPO}`
const FR_PREFIX = `/repos/${USERNAME}/${FR_REPO}`

/*
 * 获取博客列表
 * */
export async function getPosts({ page = 1, pageSize = 30 }) {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=open&page=${page}&per_page=${pageSize}`)
  return res.map(formatPost)
}

/*
 * 获取友链列表
 * */
export async function getFriends({ page = 1, pageSize = 100000 }) {
  const res = await fetchWithToken(`${FR_PREFIX}/issues?state=closed&page=${page}&per_page=${pageSize}&direction=asc`)
  return res.map(formatFriend)
}

/*
 * 搜索
 * */
export async function searchPosts({ keyword = '', page = 1, pageSize = 30 }) {
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
  const filterLabel = ['Inspiration', 'Friend', 'Book', 'About']
  const res: Tag[] = await fetchWithToken(`${BLOG_PREFIX}/labels`)
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
