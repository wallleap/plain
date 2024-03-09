<script setup lang="ts">
import { reactive, ref } from 'vue'
import { searchPosts } from '../api/index'
import type { Post } from '../types/index'

const keyword = ref('')
const posts: Post[] = reactive([])

async function searchFn() {
  const searchRes = await searchPosts({ keyword: keyword.value, pageSize: 10000 })
  Object.assign(posts, searchRes.posts)
  posts.forEach((post) => {
    post.summary = `...${post.body.substring(post.body.search(keyword.value) - 40, post.body.indexOf(keyword.value) + keyword.value.length + 40)}...`
  })
  keyword.value = ''
}
</script>

<template>
  <div class="line-height-none">
    <form class="w-100% position-relative box-border" @submit.prevent="searchFn">
      <input
        v-model="keyword"
        type="text"
        placeholder="Search"
        class="font-size-4 w-100% text-gray-600 bg-gray-100 box-border rounded-full placeholder-gray-400 border-none py-3 px-5"
      >
      <button type="submit" class="cursor-pointer text-gray-600 box-border border-none rounded-full position-absolute hover:bg-gray-300 bg-gray-200 top-50% translate-y--50% right-2 p-x-3 p-y-2">
        <i class="fa-solid fa-magnifying-glass" />
      </button>
    </form>
    <p class="text-gray-500 text-center font-size-3.6 mt-10">
      <span v-if="posts.length > 0">查找到 {{ posts.length }} 篇文章</span>
      <span v-else>输入文字搜索文章</span>
    </p>
    <ul v-if="posts.length > 0" class="list-none m-0 p-0 text-gray-500">
      <li v-for="post in posts" :key="post.id" class="group mt-6">
        <router-link :to="{ name: 'post', params: { num: post.num } }">
          <h2 class="m-0 font-bold font-size-5 group-hover:text-gray-700">
            {{ post.title }}
          </h2>
          <p class="m-0 mt-2 font-size-3.6 text-gray-400 group-hover:text-gray-600 line-height-normal">
            {{ post.summary }}
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
