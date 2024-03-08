import { fetchWithToken } from '../utils/fetch'
import { formatPost } from '../utils/format'

const GH_API = 'https://api.github.com'
const USERNAME: string = import.meta.env.V_USERNAME
const REPO: string = import.meta.env.V_REPOSITORY
const FR_REPO: string = import.meta.env.V_FRIENDS_REPO
if (!USERNAME || !REPO || !FR_REPO)
  throw new Error('V_USERNAME, V_REPOSITORY, V_FRIENDS_REPO must be set')

// API 链接拼接
const BLOG_PREFIX = `${GH_API}/repos/${USERNAME}/${REPO}`
// const FR_PREFIX = `${GH_API}/repos/${USERNAME}/${FR_REPO}`

/*
 * 获取博客列表
 * */
export async function getPosts({ page = 1, pageSize = 30 }) {
  const res = await fetchWithToken(`${BLOG_PREFIX}/issues?state=open&page=${page}&per_page=${pageSize}`)
  return res.map(formatPost)
}

/*
 * 搜索
 * */
export async function searchPosts({ keyword = '', page = 1, pageSize = 30 }) {
  const res = await fetchWithToken(`${GH_API}/search/issues?q=${keyword}repo:${USERNAME}/${REPO}+type:issue+state:open&page=${page}&per_page=${pageSize}`)
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
