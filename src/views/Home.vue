<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { usePostsStore } from '../stores/posts'
import MarkdownIt from '../components/MarkdownIt.vue'
import type { Post } from '../types/index'

const posts: Post[] = reactive([])
const postsStore = usePostsStore()

/*
 * 获取文章列表
 * */
onMounted(async () => {
  if (postsStore.postsRes.total_count === 0)
    await postsStore.getPostsAction()
  posts.push(...postsStore.postsRes.posts)
})
</script>

<template>
  <div class="home">
    <main v-if="posts?.length > 0" class="line-height-none select-none">
      <article v-for="post in posts" :key="post.id" class="group mb-12 cursor-pointer">
        <router-link :to="{ name: 'post', params: { num: Number(post.num) } }">
          <div v-if="post.milestone?.title || post.comments > 0" class="m-y-3 flex items-center">
            <span class="p-x-2 p-y-1 mr-3 bg-gray-100 border-rd font-size-3.4 text-gray-400 dark:bg-gray-800 dark:text-gray-600 group-hover:text-gray-500">{{ post.milestone.title }}</span>
            <span v-if="post.comments > 0" class="mr-3 text-gray-400 dark:text-gray-600 group-hover:text-gray-500"><i class="fa-regular fa-comments mr-1.4" />{{ post.comments }}</span>
            <span class="text-gray-400 dark:text-gray-600 group-hover:text-gray-500"><i class="fa-regular fa-eye mr-1.4" />{{ post.comments }}</span>
          </div>
          <h2 class="m-0 font-size-8 text-gray-600 font-bold dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300">
            {{ post.title }}
          </h2>
          <p class="m-y-2 font-size-4 text-gray-400 line-height-normal dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 line-2">
            <MarkdownIt :content="post.summary" />
          </p>
          <p class="m-y-4 font-size-3.4 text-gray-400 dark:text-gray-600 group-hover:text-gray-500">
            <span class="mr-2">{{ post.date }}</span>
            <template v-if="post.labels.length > 0">
              <span v-for="label in post.labels" :key="label.id" class="mr-1.4"><i class="fa-solid fa-hashtag mr-0.6 font-size-3 text-gray-300 dark:text-gray-700" />{{ label.name }}</span>
            </template>
          </p>
        </router-link>
      </article>
    </main>
    <p v-else class="font-size-4 text-gray-400 text-center">
      没有文章~
    </p>
  </div>
</template>
