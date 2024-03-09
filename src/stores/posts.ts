import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { searchPosts } from '../api'

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
    Object.assign(postsRes, await searchPosts({ keyword: '', page: 1, pageSize: 1000 }))
    return postsRes
  }
  return { postsRes, getPostsAction }
})
