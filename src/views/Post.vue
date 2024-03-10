<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getComments, getPost } from '../api/index'
import { formatDate } from '../utils/format'
import MarkdownIt from '../components/MarkdownIt.vue'
import type { Post } from '../types/index'
import { useThemeStore } from '../stores/theme'
import darkCSS from '../assets/css/atom-one-dark.css?raw'
import lightCSS from '../assets/css/atom-one-light.css?raw'

const post: Post = reactive({
  id: 1,
  title: '',
  summary: '',
  comments: 0,
  comments_url: '',
  body: '',
  date: '',
  updated: '',
  labels: [],
  milestone: {
    id: 1,
    title: '',
  },
  num: 1,
})
const comments = reactive([]) as any[]
const route = useRoute()
const postNum = Number(route.params.num)
const commentPageUrl = ref('')
const cTheme = ref('light')
const themeStore = useThemeStore()

watchEffect(async () => {
  cTheme.value = themeStore.curTheme
  const innerCode = cTheme.value === 'light' ? lightCSS : darkCSS
  const dy = document.querySelector('#dynamic-style')
  dy?.remove()
  const dynamicStyle = document.createElement('style')
  dynamicStyle.innerHTML = innerCode
  dynamicStyle.id = 'dynamic-style'
  document.head.appendChild(dynamicStyle)
})

onMounted(async () => {
  Object.assign(post, await getPost({ number: postNum }))
  commentPageUrl.value = post.comments_url.replace('comments', '')
    .replace('api.', '')
    .replace('repos/', '')
  if (post.comments > 0)
    comments.push(...await getComments({ url: post.comments_url }))
})
</script>

<template>
  <article class="text-gray-600 min-h-60vh dark:text-gray-400">
    <h1 class="text-gray-800 dark:text-gray-300">
      {{ post.title }}
    </h1>
    <div class="mb-10 text-gray-400 flex flex-wrap gap-2 items-center">
      <span v-if="post.date"><time><i class="fa-regular fa-pen-to-square mr-1 text-gray-300 dark:text-gray-600" />{{ post.date }}</time></span>
      <span v-if="post.date !== post.updated"><time><i class="fa-regular fa-calendar mr-1 text-gray-300 dark:text-gray-600" />{{ post.updated }}</time></span>
      <span>·</span>
      <span v-for="label in post.labels" :key="label.id"><i class="fa-solid fa-hashtag mr-0.6 font-size-3 text-gray-300 dark:text-gray-600" />{{ label.name }}</span>
    </div>
    <MarkdownIt :content="post.body" />
    <div v-if="post.body">
      <h2 class="text-gray-700 dark:text-gray-300">
        评论
      </h2>
      <template v-if="comments.length > 0">
        <p class="text-gray-400">
          共有 {{ comments.length }} 条评论
        </p>
        <div v-for="comment in comments" :key="comment.id" class="mb-6">
          <div class="line-height-none flex items-center">
            <img class="border-rd h-10 w-10" :src="comment.user.avatar_url" alt="avatar">
            <div class="m-l-2">
              <h3 class="m-0">
                {{ comment.user.login }}
              </h3>
              <p class="m-0 mt-1 font-size-3.4 text-gray-400">
                {{ formatDate(comment.created_at) }}
              </p>
            </div>
          </div>
          <div class="mt-3">
            <MarkdownIt :content="comment.body" />
          </div>
        </div>
      </template>
      <p v-else class="text-gray-400">
        暂时没有评论
      </p>
      <p class="text-gray-400">
        <a class="group" :href="commentPageUrl" target="_blank"><i class="fa-solid fa-link mr-1 text-gray-300 group-hover:c-primary" />前往 Issue 页面评论</a>
      </p>
    </div>
  </article>
</template>
