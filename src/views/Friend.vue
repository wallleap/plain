<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getFriends, getFriendsByComments } from '../api'
import Utterance from '../components/Utterance.vue'
import type { Friend } from '../types'

const myName = import.meta.env.V_NAME
const myUrl = import.meta.env.V_URL
const myAvatar = import.meta.env.V_AVATAR
const myDesc = import.meta.env.V_DESC
const utt = import.meta.env.V_UTTERANCES_CODE
const friendRepo = import.meta.env.V_FRIENDS_REPO || ''
const friends: Friend[] = reactive([])

document.title = `${import.meta.env.V_TITLE} | 友链`

onMounted(async () => {
  if (friendRepo)
    Object.assign(friends, await getFriends({}))
  else
    Object.assign(friends, await getFriendsByComments())
})
</script>

<template>
  <nav v-if="friends.length > 0">
    <ul class="m-0 flex flex-wrap list-none justify-center gap-4 p-0 slide-enter-800">
      <li v-for="friend in friends" :key="friend.name" class="cursor-pointer select-none" :title="friend.desc">
        <span v-if="friend.tag?.name === '未添加'" class="group position-relative inline-block">
          <span class="position-absolute left--2 top--1 z-10 rounded-full bg-gray-100 px-2 py-0.5 font-size-2.4 text-gray-600 group-hover:translate-y--4 dark:bg-gray-800 dark:text-gray-500">{{ friend.tag?.name }}</span>
          <figure class="m-0 inline-block h-12 w-12 overflow-hidden rounded-full group-hover:translate-y--4">
            <img class="inline-block h-100% w-100% select-none rounded-full bg-gray-100 dark:bg-gray-800" :src="friend.avatar" :alt="friend.name">
          </figure>
          <h3 class="position-absolute bottom-0 left-50% z-20 m-0 hidden translate-x--50% rounded bg-light-300 px-2 py-0.5 text-nowrap font-size-3 text-gray-600 group-hover:inline-block dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </span>
        <a v-else :href="friend.url" target="_blank" class="group position-relative inline-block">
          <span v-if="friend.tag?.name === '失联'" class="position-absolute left--2 top--1 z-10 rounded-full bg-red-100 px-2 py-0.5 font-size-2.4 text-red-600 group-hover:translate-y--4 dark:bg-red-900 dark:text-red-300">{{ friend.tag.name }}</span>
          <span v-if="friend.tag && friend.tag.name !== '失联' && friend.tag.name !== '' && friend.tag.color !== '' && friend.tag.bg !== ''" :style="[`color: ${friend.tag.color}`, `background: ${friend.tag.bg};`, `border: 0.5px solid ${friend.tag.color};`]" class="position-absolute left--2 top--1 z-10 rounded-full px-2 py-0.5 font-size-2.4 group-hover:translate-y--4 dark:bg-blue-gray-800 dark:text-blue-400">{{ friend.tag.name }}</span>
          <span v-else-if="friend.tag && friend.tag.name !== ''" class="position-absolute left--2 top--1 z-10 rounded-full bg-blue-100 px-2 py-0.5 font-size-2.4 text-blue-600 group-hover:translate-y--4 dark:bg-blue-gray-800 dark:text-blue-400">{{ friend.tag.name }}</span>
          <figure class="m-0 inline-block h-12 w-12 overflow-hidden rounded-full group-hover:translate-y--4 group-hover:scale-130">
            <img class="inline-block h-100% w-100% select-none rounded-full bg-gray-100" :src="friend.avatar" :alt="friend.name">
          </figure>
          <h3 class="position-absolute bottom-0 left-50% z-20 m-0 hidden translate-x--50% rounded bg-light-300 px-2 py-0.5 text-nowrap font-size-3 text-gray-600 group-hover:inline-block dark:bg-dark-300 dark:text-light-200">{{ friend.name }}</h3>
        </a>
      </li>
    </ul>
    <div v-if="friends.length" class="font-size-4 text-gray-600 slide-enter-1000 dark:text-gray-400">
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
    <div v-if="utt" class="slide-enter-1200">
      <Utterance :utt-script="utt" />
    </div>
  </nav>
  <p v-else class="animate-blink animate-iteration-infinite text-center font-size-4 text-gray-400">
    页面加载中...
  </p>
</template>
