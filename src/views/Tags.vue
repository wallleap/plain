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
  <div>
    <ul class="list-none flex justify-center select-none text-gray-400 flex-wrap gap-x-2">
      <li v-for="tag in tags" :key="tag.id" class="group cursor-pointer position-relative rounded-full hover:text-gray-600 px-2 py-1 text-sm" @click="filterPost(tag.id)">
        <span>{{ tag.name }}</span>
        <span v-if="tag.count > 0" class="text-gray-300 font-size-2.4 align-super ml-0.4 group-hover:text-gray-400">{{ tag.count }}</span>
      </li>
    </ul>
    <ul v-if="showPosts.length > 0" class="mt-6">
      <p>
        该标签下共有 {{ showPosts.length }} 篇文章
      </p>
      <li v-for="showPost in showPosts" :key="showPost.id">
        <router-link :to="{ name: 'post', params: { num: showPost.num } }">
          {{ showPost.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
