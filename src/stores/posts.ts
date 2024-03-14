import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { getCounter, searchPosts } from '../api'
import type { Post } from '../types/index'

/*
 * ref()s become state properties
 * computed()s become getters
 * function()s become actions
 * */
export const usePostsStore = defineStore('posts', () => {
  const postsRes = reactive({
    total_count: 0,
    posts: [],
  })
  async function getPostsAction() {
    try {
      const res = await searchPosts({ keyword: '' })
      const ids = res.posts.map((post: Post) => post.id)
      const times = await getCounter(ids)
      if (times) {
        res.posts.forEach((post: Post) => {
          // @ts-expect-error 这样用暂时没有发现错误
          post.times = times[post.id] || 1
        })
      }
      else {
        console.error('getCounter failed')
      }
      Object.assign(postsRes, res)
      return postsRes
    }
    catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }
  return { postsRes, getPostsAction }
})
