<script setup lang="ts">
import { onMounted, reactive, watchEffect } from 'vue'
import { getTags } from '../api/index'
import { usePostsStore } from '../stores/posts'
import type { Post, Tag } from '../types/index'

const postsStore = usePostsStore()
const tags: Tag[] = reactive([])
const posts: Post[] = reactive([])
const showPosts: Post[] = reactive([])

onMounted(async () => {
  tags.push(...await getTags())
  if (postsStore.postsRes.total_count === 0)
    postsStore.getPostsAction()
})

watchEffect(() => {
  Object.assign(posts, postsStore.postsRes.posts)
  tags.forEach((tag) => {
    tag.count = posts.filter(post => post.labels.some(label => label.id === tag.id)).length
  })
})

function filterPost(id: number) {
  showPosts.length = 0
  posts.forEach((post) => {
    post.labels.forEach((label) => {
      if (label.id === id)
        showPosts.push(post)
    })
  })
}
</script>

<template>
  <nav v-if="tags.length > 0">
    <ul v-if="posts.length > 0" class="flex flex-wrap select-none list-none justify-center gap-x-2 text-gray-400 slide-enter-1">
      <li v-for="tag in tags" :key="tag.id" class="group position-relative cursor-pointer rounded-full px-2 py-1 text-sm hover:text-gray-600 dark:hover:text-gray-300" @click="filterPost(tag.id)">
        <span>{{ tag.name }}</span>
        <span v-if="tag.count > 0" class="ml-0.4 align-super font-size-2.4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:hover:text-gray-500">{{ tag.count }}</span>
      </li>
    </ul>
    <ul v-if="showPosts.length > 0" class="mt-6 slide-enter-1">
      <p>
        该标签下共有 {{ showPosts.length }} 篇文章
      </p>
      <li v-for="showPost in showPosts" :key="showPost.id" class="slide-enter-100">
        <router-link :to="{ name: 'post', params: { num: Number(showPost.num) } }">
          {{ showPost.title }}
        </router-link>
      </li>
    </ul>
  </nav>
  <p v-else class="animate-blink animate-iteration-infinite text-center font-size-4 text-gray-400">
    标签加载中...
  </p>
</template>
