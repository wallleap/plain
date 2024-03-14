<script setup lang="ts">
import { reactive, ref } from 'vue'
import { searchPosts } from '../api/index'
import type { Post } from '../types/index'

const keyword = ref('')
const posts: Post[] = reactive([])

async function searchFn() {
  const searchRes = await searchPosts({ keyword: keyword.value })
  Object.assign(posts, searchRes.posts)
  posts.forEach((post) => {
    post.summary = `...${post.body.substring(post.body.search(keyword.value) - 40, post.body.indexOf(keyword.value) + keyword.value.length + 40)}...`
  })
  keyword.value = ''
}
</script>

<template>
  <div class="line-height-none slide-enter-1000">
    <form class="position-relative box-border w-100%" @submit.prevent="searchFn">
      <input
        v-model="keyword"
        type="text"
        placeholder="Search"
        class="box-border w-100% rounded-full border-none bg-gray-100 px-5 py-3 font-size-4 text-gray-600 dark:bg-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-700"
      >
      <button type="submit" class="position-absolute right-2 top-50% box-border translate-y--50% cursor-pointer rounded-full border-none bg-gray-200 p-x-3 p-y-2 text-gray-600 dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-500 dark:hover:bg-gray-600">
        <i class="fa-solid fa-magnifying-glass" />
      </button>
    </form>
    <p class="mt-10 text-center font-size-3.6 text-gray-500">
      <span v-if="posts.length > 0">查找到 {{ posts.length }} 篇文章</span>
      <span v-else>输入文字搜索文章</span>
    </p>
    <nav>
      <ul v-if="posts.length > 0" class="m-0 list-none p-0 text-gray-500 slide-enter-1000 dark:text-gray-400">
        <li v-for="post in posts" :key="post.id" class="group mt-6">
          <router-link :to="{ name: 'post', params: { num: Number(post.num) } }">
            <h2 class="m-0 font-size-5 font-bold group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {{ post.title }}
            </h2>
            <p class="m-0 mt-2 font-size-3.6 text-gray-400 line-height-normal group-hover:text-gray-600 dark:group-hover:text-gray-400">
              {{ post.summary }}
            </p>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
