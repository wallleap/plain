<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getComments, getPost } from '../api/index'
import { formatDate } from '../utils/format'
import type { Post } from '../types/index'

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
  <article class="text-gray-600">
    <h1 class="text-gray-800">
      {{ post.title }}
    </h1>
    <div class="flex items-center text-gray-400 gap-2 mb-10">
      <span><time><i class="fa-regular mr-1 text-gray-300 fa-pen-to-square" />{{ post.date }}</time></span>
      <span v-if="post.date !== post.updated"><time><i class="fa-regular mr-1 text-gray-300 fa-calendar" />{{ post.updated }}</time></span>
      <span>·</span>
      <span v-for="label in post.labels" :key="label.id"><i class="fa-solid fa-hashtag font-size-3 mr-0.6 text-gray-300" />{{ label.name }}</span>
    </div>
    <!-- TODO: Markdown 渲染 -->
    <div>{{ post.body }}</div>
    <div>
      <h2 class="text-gray-700">
        评论
      </h2>
      <template v-if="comments.length > 0">
        <p class="text-gray-400">
          共有 {{ comments.length }} 条评论
        </p>
        <div v-for="comment in comments" :key="comment.id" class="mb-6">
          <div class="flex items-center line-height-none">
            <img class="w-10 h-10 border-rd" :src="comment.user.avatar_url" alt="avatar">
            <div class="m-l-2">
              <h3 class="m-0">
                {{ comment.user.login }}
              </h3>
              <p class="m-0 font-size-3.4 text-gray-400 mt-1">
                {{ formatDate(comment.created_at) }}
              </p>
            </div>
          </div>
          <!-- TODO: Markdown 渲染 -->
          <div class="mt-3">
            {{ comment.body }}
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
