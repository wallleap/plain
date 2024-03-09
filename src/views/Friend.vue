<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getFriends } from '../api'
import Utterance from '../components/Utterance.vue'
import type { Friend } from '../types'

const myName = import.meta.env.V_NAME
const myUrl = import.meta.env.V_URL
const myAvatar = import.meta.env.V_AVATAR
const myDesc = import.meta.env.V_DESC
const utt = import.meta.env.V_UTTERANCES_CODE
const friends: Friend[] = reactive([])

document.title = `${import.meta.env.V_TITLE} | 友链`

onMounted(async () => {
  Object.assign(friends, await getFriends({}))
})
</script>

<template>
  <nav>
    <ul class="list-none p-0 m-0 flex flex-wrap gap-4 justify-center">
      <li v-for="friend in friends" :key="friend.id" class="cursor-pointer" :title="friend.desc">
        <span v-if="friend.labels[0]?.name === '未添加'" class="group inline-block position-relative">
          <span class="px-2 py-0.5 bg-gray-100 rounded-full font-size-2.4 text-gray-600 position-absolute left--2 top--1 z-10 dark:bg-gray-800 dark:text-gray-500 group-hover:translate-y--4">{{ friend.labels[0]?.name }}</span>
          <img class="inline-block bg-gray-100 rounded-full h-12 w-12 dark:bg-gray-800 group-hover:translate-y--4" :src="friend.avatar" :alt="friend.name">
          <h3 class="px-2 py-0.5 hidden bg-light-300 rounded font-size-3 text-gray-600 position-absolute bottom--2 left-50% z-20 translate-x--50% text-nowrap group-hover:inline dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </span>
        <a v-else :href="friend.url" target="_blank" class="group inline-block position-relative">
          <span v-if="friend.labels[0] && friend.labels[0]?.name !== '失联'" class="px-2 py-0.5 bg-blue-100 rounded-full font-size-2.4 text-blue-600 position-absolute left--2 top--1 z-10 dark:bg-blue-gray-800 dark:text-blue-400 group-hover:translate-y--4">{{ friend.labels[0]?.name }}</span>
          <span v-if="friend.labels[0]?.name === '失联'" class="px-2 py-0.5 bg-red-100 rounded-full font-size-2.4 text-red-600 position-absolute left--2 top--1 z-10 dark:bg-red-900 dark:text-red-300 group-hover:translate-y--4">{{ friend.labels[0]?.name }}</span>
          <img class="inline-block bg-gray-100 rounded-full h-12 w-12 group-hover:translate-y--4 group-hover:scale-130" :src="friend.avatar" :alt="friend.name">
          <h3 class="px-2 py-0.5 hidden bg-light-300 rounded font-size-3 text-gray-600 position-absolute bottom--2 left-50% z-20 translate-x--50% text-nowrap group-hover:inline dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </a>
      </li>
    </ul>
    <div v-if="friends.length" class="font-size-4 text-gray-600 dark:text-gray-400">
      <p>欢迎访问我的博客，希望可以给你带来帮助</p>
      <p>如果需要添加友链，请留言，我会尽快处理</p>
      <p>以下是本站的友链信息：</p>
      <pre class="p-4 bg-light-400 rounded flex flex-col whitespace-unset overflow-x-auto dark:bg-dark-500">
        <code class="text-nowrap">name: {{ myName }}</code>
        <code class="text-nowrap">url: {{ myUrl }}</code>
        <code class="text-nowrap">avatar: {{ myAvatar }}</code>
        <code class="text-nowrap">desc: {{ myDesc }}</code>
      </pre>
    </div>
    <div v-if="utt">
      <Utterance />
    </div>
  </nav>
</template>
