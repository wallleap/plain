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
    <ul class="m-0 flex flex-wrap list-none justify-center gap-4 p-0">
      <li v-for="friend in friends" :key="friend.id" class="cursor-pointer" :title="friend.desc">
        <span v-if="friend.labels[0]?.name === '未添加'" class="group position-relative inline-block">
          <span class="position-absolute left--2 top--1 z-10 rounded-full bg-gray-100 px-2 py-0.5 font-size-2.4 text-gray-600 group-hover:translate-y--4 dark:bg-gray-800 dark:text-gray-500">{{ friend.labels[0]?.name }}</span>
          <img class="inline-block h-12 w-12 rounded-full bg-gray-100 group-hover:translate-y--4 dark:bg-gray-800" :src="friend.avatar" :alt="friend.name">
          <h3 class="position-absolute bottom--2 left-50% z-20 hidden translate-x--50% rounded bg-light-300 px-2 py-0.5 text-nowrap font-size-3 text-gray-600 group-hover:inline dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </span>
        <a v-else :href="friend.url" target="_blank" class="group position-relative inline-block">
          <span v-if="friend.labels[0] && friend.labels[0]?.name !== '失联'" class="position-absolute left--2 top--1 z-10 rounded-full bg-blue-100 px-2 py-0.5 font-size-2.4 text-blue-600 group-hover:translate-y--4 dark:bg-blue-gray-800 dark:text-blue-400">{{ friend.labels[0]?.name }}</span>
          <span v-if="friend.labels[0]?.name === '失联'" class="position-absolute left--2 top--1 z-10 rounded-full bg-red-100 px-2 py-0.5 font-size-2.4 text-red-600 group-hover:translate-y--4 dark:bg-red-900 dark:text-red-300">{{ friend.labels[0]?.name }}</span>
          <img class="inline-block h-12 w-12 rounded-full bg-gray-100 group-hover:translate-y--4 group-hover:scale-130" :src="friend.avatar" :alt="friend.name">
          <h3 class="position-absolute bottom--2 left-50% z-20 hidden translate-x--50% rounded bg-light-300 px-2 py-0.5 text-nowrap font-size-3 text-gray-600 group-hover:inline dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </a>
      </li>
    </ul>
    <div v-if="friends.length" class="font-size-4 text-gray-600 dark:text-gray-400">
      <p>欢迎访问我的博客，希望可以给你带来帮助</p>
      <p>如果需要添加友链，请留言，我会尽快处理</p>
      <p>以下是本站的友链信息：</p>
      <pre class="flex flex-col overflow-x-auto whitespace-unset rounded bg-light-400 p-4 dark:bg-dark-500">
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
