<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Typed from 'typed.js'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { getAbout } from '../api/index'
import MarkdownIt from '../components/MarkdownIt.vue'
import { hexToHSL } from '../utils/index'
import { colors, skillList1, skillList2, typingStrings } from '../utils/config'

const author = import.meta.env.V_AUTHOR || ''
const personalTags = import.meta.env.V_TAGS ? import.meta.env.V_TAGS.split(',') : []
const about = ref('')
const authorRef = ref(null)
let typed: Typed
const bUrl = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'

onMounted(async () => {
  typed = new Typed(authorRef.value, {
    strings: typingStrings,
    // 打字速度
    typeSpeed: 200,
    // 退格速度
    backSpeed: 100,
    // 是否循环
    loop: true,
  })
  about.value = await getAbout()
  if (about.value.includes('busuanzi')) {
    document.querySelectorAll('script').forEach((script) => {
      if (script.src.includes('busuanzi'))
        script.remove()
    })
    const bScript = document.createElement('script')
    bScript.src = bUrl
    bScript.defer = true
    bScript.async = true
    document.body.appendChild(bScript)
  }
})

onUnmounted(() => {
  if (typed)
    typed.destroy()
})

const tagsObj = personalTags.map((tag: string, index: number) => {
  const colorIndex = index % colors.length
  const hslValue = hexToHSL(colors[colorIndex])
  return {
    name: tag,
    color: colors[colorIndex],
    bgColor: `hsla(${hslValue[0]}, ${hslValue[1]}%, ${hslValue[2]}%, 0.05)`,
  }
})
</script>

<template>
  <div class="about-page slide-enter-1">
    <div>
      <p class="m-0 my-2">
        你好，欢迎访问<strong>我的博客</strong> 👋🏻
      </p>
      <p class="position-relative m-0 my-2 inline-block h-6">
        <span class="position-absolute left-0 top-0">我是</span>
        <strong ref="authorRef" class="main-text ml-2.4rem mt--0.3em font-size-6">{{ author }}</strong>
      </p>
      <p class="m-0 my-2">
        不应该随便给一个人打标签，但我觉得这样可以让你更快了解我
      </p>
      <ul class="flex flex-wrap list-none gap-1 p-0">
        <li
          v-for="tag in tagsObj" :key="tag.name"
          :style="{
            backgroundColor: tag.bgColor,
            color: tag.color,
            border: `1px solid ${tag.color}`,
          }"
          class="border-1px border-yellow-600 rounded-full border-solid bg-yellow-100 px-2 py-0.5 text-sm text-yellow-600"
        >
          {{ tag.name }}
        </li>
      </ul>
      <h2><svg t="1714296498117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6548" width="200" height="200"><path d="M894.39 193.61A222.53 222.53 0 0 0 736 128H288A224 224 0 0 0 64 352v320a224 224 0 0 0 224 224h448a224 224 0 0 0 224-224V352a222.53 222.53 0 0 0-65.61-158.39zM768 640c-70.83 0-128.41-57.83-128-128.75 0.41-70.63 58.78-127.25 129.41-127.25H880a16 16 0 0 1 16 16v224a16 16 0 0 1-16 16z m-32 192H288a160 160 0 0 1-160-160V352a160 160 0 0 1 160-160h448c69.5 0 128.78 44.54 150.82 106.57A16 16 0 0 1 871.77 320H769.66C664.11 320 576.05 406.35 576 511.9 576 617.82 662.1 704 768 704h103.77a16 16 0 0 1 15.05 21.43C864.78 787.46 805.5 832 736 832z" fill="currentColor" p-id="6549" /><path d="M224 320h144a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H224a32 32 0 0 1-32-32 32 32 0 0 1 32-32z" fill="#EB4242" p-id="6550" /><path d="M736 512m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="currentColor" p-id="6551" /></svg> 常用技术栈/工具</h2>
      <Vue3SeamlessScroll
        :list="skillList1"
        direction="left"
        :step="0.5"
        :hover="true"
        :single-line="true"
      >
        <ul class="flex flex-nowrap list-none gap-2 p-0">
          <li
            v-for="skill in skillList1"
            :key="skill.name"
            class="border-1px border-gray-200 rounded-full border-solid px-3 py-1 text-nowrap text-sm text-gray-600 dark:border-gray-6 dark:text-gray-300"
          >
            <i :class="skill.icon" /> {{ skill.name }}
          </li>
        </ul>
      </Vue3SeamlessScroll>
      <Vue3SeamlessScroll
        :list="skillList1"
        direction="right"
        :step="0.5"
        :hover="true"
        :single-line="true"
      >
        <ul class="flex flex-nowrap list-none gap-2 p-0">
          <li
            v-for="skill in skillList2"
            :key="skill.name"
            class="border-1px border-gray-200 rounded-full border-solid px-3 py-1 text-nowrap text-sm text-gray-600 dark:border-gray-6 dark:text-gray-300"
          >
            <i :class="skill.icon" /> {{ skill.name }}
          </li>
        </ul>
      </Vue3SeamlessScroll>
    </div>
    <div v-if="about" class="text-gray-600 dark:text-gray-300">
      <MarkdownIt :content="about" />
    </div>
    <p v-else class="animate-blink animate-iteration-infinite text-center font-size-4 text-gray-400">
      页面加载中...
    </p>
  </div>
</template>
