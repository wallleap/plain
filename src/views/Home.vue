<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getPosts, searchPosts } from '../api/index'
import type { Post } from '../types/index'

const PAGESIZE = import.meta.env.V_PAGESIZE
const pageNum = ref(1)
const totalCount = ref(0)
const posts: Post[] = reactive([])

const showMore = computed(() => {
  return pageNum.value < totalCount.value / PAGESIZE && posts.length > 0
})

/*
 * 获取文章列表
 * */
onMounted(async () => {
  // 通过搜索获取文章数
  const searchRes = await searchPosts({ keyword: '', page: 1, pageSize: 1 })
  const getRes = await getPosts({ page: pageNum.value, pageSize: PAGESIZE })
  totalCount.value = searchRes?.total_count
  getRes.forEach((post: Post) => {
    posts.push(post)
  })
})

/*
 * 加载下一页
 * */
async function loadMore() {
  pageNum.value++
  const t = await getPosts({ page: pageNum.value, pageSize: PAGESIZE })
  t.forEach((post: Post) => {
    posts.push(post)
  })
}
</script>

<template>
  <main v-if="posts?.length > 0" class="line-height-none select-none">
    <article v-for="post in posts" :key="post.id" class="group mb-12 cursor-pointer">
      <router-link :to="{ name: 'post', params: { num: post.num } }">
        <div v-if="post.milestone?.title || post.comments > 0" class="flex items-center m-y-3">
          <span class="mr-3 p-x-2 p-y-1 bg-gray-100 font-size-3.4 border-rd text-gray-400 group-hover:text-gray-500">{{ post.milestone.title }}</span>
          <span v-if="post.comments > 0" class="mr-3 text-gray-400 group-hover:text-gray-500"><i class="fa-regular fa-comments mr-1.4" />{{ post.comments }}</span>
          <span class="text-gray-400 group-hover:text-gray-500"><i class="fa-regular fa-eye mr-1.4" />{{ post.comments }}</span>
        </div>
        <h2 class="m-0 font-size-8 text-gray-600 font-bold group-hover:text-gray-800">
          {{ post.title }}
        </h2>
        <p class="m-y-2 font-size-4 text-gray-400 line-height-normal group-hover:text-gray-500 line-2">
          {{ post.summary }}
        </p>
        <p class="m-y-4 font-size-3.4 text-gray-400 group-hover:text-gray-500">
          <span class="mr-2">{{ post.date }}</span>
          <template v-if="post.labels.length > 0">
            <span v-for="label in post.labels" :key="label.id" class="mr-1.4"><i class="fa-solid fa-hashtag font-size-3 mr-0.6 text-gray-300" />{{ label.name }}</span>
          </template>
        </p>
      </router-link>
    </article>
    <div class="mb-12 flex items-center gap-6 text-gray-400 font-size-4 cursor-pointer">
      <span v-show="showMore" class="flex items-center gap-1 hover:text-gray-600" @click="loadMore">加载更多<i class="fa-solid fa-chevron-right font-size-3.4" /></span>
    </div>
  </main>
  <p v-else class="text-center font-size-4 text-gray-400">
    没有文章~
  </p>
</template>
