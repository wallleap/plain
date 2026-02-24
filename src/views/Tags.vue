<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getTags, searchPosts } from '../api/index'
import type { Post, Tag } from '../types/index'

const tags = ref<Tag[]>([])
const allPosts = ref<Post[]>([])
const activeTagId = ref<number | null>(null) // 选中的标签ID，null表示全部
const loading = ref(false)
const error = ref<string | null>(null)

const tagsWithCount = computed(() => {
  return tags.value.map(tag => ({
    ...tag,
    count: allPosts.value.filter(post =>
      post.labels.some(label => label.id === tag.id),
    ).length,
  }))
})

const filteredPosts = computed(() => {
  if (activeTagId.value === null)
    return allPosts.value

  return allPosts.value.filter(post =>
    post.labels.some(label => label.id === activeTagId.value),
  )
})

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const [tagsRes, postsRes] = await Promise.all([
      getTags(),
      searchPosts({ keyword: '' }),
    ])
    tags.value = tagsRes
    allPosts.value = postsRes.posts
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '数据加载失败'
    console.error('数据加载错误:', err)
  }
  finally {
    loading.value = false
  }
}

function handleTagClick(id: number | null) {
  activeTagId.value = id
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <nav v-if="tags.length > 0">
    <ul class="flex flex-wrap select-none list-none items-end justify-center gap-x-2 text-gray-400 slide-enter-1">
      <li v-for="tag in tagsWithCount" :key="tag.id" class="group position-relative cursor-pointer rounded-full px-2 py-1 text-sm hover:text-gray-600 dark:hover:text-gray-300" @click="handleTagClick(tag.id)">
        <span>{{ tag.name }}</span>
        <span v-if="tag.count > 0" class="ml-0.4 align-super font-size-2.4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:hover:text-gray-500">{{ tag.count }}</span>
      </li>
    </ul>
    <ul v-if="filteredPosts.length > 0" class="mt-6 slide-enter-1">
      <p v-if="allPosts.length === filteredPosts.length">
        目前共有 {{ allPosts.length }} 篇文章，可以点击标签进行筛选
      </p>
      <p v-else>
        该标签下共有 {{ filteredPosts.length }} 篇文章，共 {{ allPosts.length }} 篇文章
      </p>
      <li v-for="showPost in filteredPosts" :key="showPost.id" class="slide-enter-100">
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
