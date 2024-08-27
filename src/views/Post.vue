<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getComments, getPost, setCounter } from '../api/index'
import { debounce } from '../utils/index'
import { formatDate } from '../utils/format'
import MarkdownIt from '../components/MarkdownIt.vue'
import type { Post } from '../types/index'
import { useThemeStore } from '../stores/theme'
import darkCSS from '../assets/css/atom-one-dark.css?raw'
import lightCSS from '../assets/css/atom-one-light.css?raw'

const post: Post = reactive({
  id: 1,
  title: '',
  times: 1,
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
const commentPageUrl = ref('')
const cTheme = ref('light')
const themeStore = useThemeStore()

function scrollToAnchor(anchorId: string) {
  const element = document.getElementById(decodeURIComponent(anchorId))
  if (element)
    element.scrollIntoView({ behavior: 'instant', block: 'start' })
}

function activeAnchor(currentAnchor: HTMLElement) {
  const tocWrapper = document.querySelector('#toc-wrapper')
  const linkAnchors = tocWrapper?.querySelectorAll('a')
  if (linkAnchors) {
    linkAnchors.forEach((linkAnchor) => {
      linkAnchor.classList.remove('active')
    })
    currentAnchor.classList.add('active')
  }
}

function navLinkAnchor() {
  const tocWrapper = document.querySelector('#toc-wrapper')
  const linkAnchors = tocWrapper!.querySelectorAll('a')
  const titles: HTMLElement[] = []
  if (linkAnchors) {
    linkAnchors.forEach((linkAnchor) => {
      const anchorId = linkAnchor.getAttribute('href') || ''
      const title = document.getElementById(decodeURIComponent(anchorId?.slice(1)))
      if (title)
        titles.push(title)
      if (location.hash === linkAnchor.getAttribute('href')) {
        activeAnchor(linkAnchor)
        scrollToAnchor(anchorId?.slice(1))
      }
      else {
        activeAnchor(linkAnchors[0])
      }
      linkAnchor.addEventListener('click', (e) => {
        e.preventDefault()
        activeAnchor(linkAnchor)
        const anchorId = linkAnchor.getAttribute('href') || ''
        scrollToAnchor(anchorId?.slice(1))
      })
    })
  }
  window.addEventListener('scroll', debounce(() => {
    const range = [0, 300]
    const screenHeight = document.documentElement.clientHeight
    const rects = titles.map(title => title.getBoundingClientRect())
    for (let i = 0; i < titles.length; i++) {
      const rect = rects[i]
      const isInRange = rect.top >= range[0] && rect.top <= range[1]
      const isOutViewport = rect.top < range[0] && rects[i + 1] && (rects[i + 1].top >= screenHeight || rects[i + 1].top >= range[1])
      if (isInRange || isOutViewport) {
        activeAnchor(linkAnchors[i])
        break
      }
      if (rects[0].top >= screenHeight || rects[0].top >= range[1]) {
        activeAnchor(linkAnchors[0])
        break
      }
      if (rects[titles.length - 1].top <= range[0]) {
        activeAnchor(linkAnchors[titles.length - 1])
        break
      }
    }
  }, 100))
}

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
  try {
    Object.assign(post, await getPost({ number: Number(route.params.num) }))
    setCounter(post)
    if (post.title)
      document.title = `${post.title} - ${import.meta.env.V_TITLE}`
    commentPageUrl.value = post.comments_url.replace('comments', '')
      .replace('api.', '')
      .replace('repos/', '')
    if (post.comments > 0)
      comments.push(...await getComments({ url: post.comments_url }))
    await nextTick()
    if (route.hash && post.body)
      scrollToAnchor(route.hash.slice(1))
    navLinkAnchor()
  }
  catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  document.title = import.meta.env.V_TITLE
})
</script>

<template>
  <article v-if="post.title" class="min-h-60vh text-gray-600 slide-enter-1000 dark:text-gray-400">
    <h1 class="text-gray-800 dark:text-gray-300">
      {{ post.title }}
    </h1>
    <div class="mb-10 flex flex-wrap items-center gap-2 text-gray-400">
      <span v-if="post.date"><time><i class="fa-regular fa-pen-to-square mr-1 text-gray-300 dark:text-gray-600" />{{ post.date }}</time></span>
      <span v-if="post.date !== post.updated"><time><i class="fa-regular fa-calendar mr-1 text-gray-300 dark:text-gray-600" />{{ post.updated }}</time></span>
      <span>·</span>
      <span v-for="label in post.labels" :key="label.id"><i class="fa-solid fa-hashtag mr-0.6 font-size-3 text-gray-300 dark:text-gray-600" />{{ label.name }}</span>
    </div>
    <MarkdownIt :content="post.body" :render-toc="true" />
    <div v-if="post.body">
      <h2 class="text-gray-700 dark:text-gray-300">
        评论
      </h2>
      <template v-if="comments.length > 0">
        <p class="text-gray-400">
          共有 {{ comments.length }} 条评论
        </p>
        <div v-for="comment in comments" :key="comment.id" class="mb-6">
          <div class="flex items-center line-height-none">
            <img class="h-10 w-10 border-rd" :src="comment.user.avatar_url" alt="avatar">
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
        <a class="group" :href="commentPageUrl" target="_blank"><i class="fa-solid fa-link mr-1 text-gray-300 dark:text-gray-700 group-hover:c-primary" />前往 Issue 页面评论</a>
      </p>
    </div>
  </article>
  <p v-else class="animate-blink animate-iteration-infinite text-center font-size-4 text-gray-400">
    文章加载中……
  </p>
</template>
