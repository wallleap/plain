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

onMounted(async () => {
  Object.assign(friends, await getFriends({}))
})
</script>

<template>
  <div>
    <ul class="m-0 p-0 flex gap-4 list-none justify-center flex-wrap">
      <li v-for="friend in friends" :key="friend.id" class="cursor-pointer" :title="friend.desc">
        <span v-if="friend.labels[0]?.name === '未添加'" class="position-relative inline-block group">
          <span class="bg-gray-100 text-gray-600 position-absolute z-10 left--2 top--1 font-size-2.4 py-0.5 px-2 rounded-full group-hover:translate-y--4">{{ friend.labels[0]?.name }}</span>
          <img class="bg-gray-100 inline-block rounded-full group-hover:translate-y--4 w-12 h-12" :src="friend.avatar" :alt="friend.name">
          <h3 class="position-absolute py-0.5 px-2 hidden z-20 left-50% translate-x--50% bottom--2 text-nowrap font-size-3 bg-light-300 rounded group-hover:inline group-hover:text-gray-600">{{ friend.name }}</h3>
        </span>
        <a v-else :href="friend.url" target="_blank" class="position-relative inline-block group">
          <span v-if="friend.labels[0] && friend.labels[0]?.name !== '失联'" class="position-absolute z-10 left--2 top--1 font-size-2.4 py-0.5 px-2 rounded-full group-hover:translate-y--4 bg-blue-100 text-blue-600">{{ friend.labels[0]?.name }}</span>
          <span v-if="friend.labels[0]?.name === '失联'" class="position-absolute z-10 left--2 top--1 font-size-2.4 py-0.5 px-2 rounded-full group-hover:translate-y--4 bg-red-100 text-red-600">{{ friend.labels[0]?.name }}</span>
          <img class="bg-gray-100 inline-block w-12 h-12 rounded-full group-hover:translate-y--4 group-hover:scale-130" :src="friend.avatar" :alt="friend.name">
          <h3 class="hidden position-absolute z-20 left-50% translate-x--50% bottom--2 text-nowrap font-size-3 bg-light-300 rounded group-hover:inline group-hover:text-gray-600 py-0.5 px-2">{{ friend.name }}</h3>
        </a>
      </li>
    </ul>
    <div class="text-gray-600 font-size-4">
      <p>欢迎访问我的博客，希望可以给你带来帮助</p>
      <p>如果需要添加友链，请留言，我会尽快处理</p>
      <p>以下是本站的友链信息：</p>
      <pre class="flex rounded flex-col bg-light-400 whitespace-unset p-4 overflow-x-auto">
        <code class="text-nowrap">name: {{ myName }}</code>
        <code class="text-nowrap">url: {{ myUrl }}</code>
        <code class="text-nowrap">avatar: {{ myAvatar }}</code>
        <code class="text-nowrap">desc: {{ myDesc }}</code>
      </pre>
    </div>
    <div v-if="utt">
      <Utterance />
    </div>
  </div>
</template>
