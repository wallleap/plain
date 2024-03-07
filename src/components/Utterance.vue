<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// types
interface UTTERANCES_OPTS {
  value: {
    async: boolean
    src: string
    repo: string
    term: string
    label: string
    theme: string
    crossorigin: string
  }
}

// parse utterances code
const script = import.meta.env.V_UTTERANCES_CODE
const utterancesOpts: UTTERANCES_OPTS = computed(() => {
  const scriptTag = script
  const regex = /(\w+)\s*=\s*["']([^"']+)["']/g
  const matches = scriptTag.match(regex)
  const obj = {
    async: false,
    src: 'https://utteranc.es/client.js',
    repo: '',
    term: 'title',
    label: 'Comment',
    theme: 'github-light',
    crossorigin: 'anonymous',
  }
  if (scriptTag.includes('async'))
    obj.async = true
  matches?.forEach((match: string) => {
    const regRes: RegExpMatchArray | null = match.match(/(\w+)\s*=\s*["']([^"']+)["']/)
    if (!regRes)
      return
    const objKey: keyof typeof obj = regRes[1] as keyof typeof obj
    if (objKey)
      obj[objKey] = regRes[2] as never
  })
  return obj
})

// create utterances script
const utterancesEL = document.createElement('script')
utterancesEL.async = utterancesOpts.value.async || false
utterancesEL.setAttribute('src', utterancesOpts.value.src || 'https://utteranc.es/client.js')
utterancesEL.setAttribute('repo', utterancesOpts.value.repo)
utterancesEL.setAttribute('issue-term', utterancesOpts.value.term)
if (utterancesOpts.value.label !== '')
  utterancesEL.setAttribute('label', utterancesOpts.value.label)
utterancesEL.setAttribute('theme', utterancesOpts.value.theme)
utterancesEL.setAttribute('crossorigin', utterancesOpts.value.crossorigin || 'anonymous')
const commentContent = ref<HTMLDivElement | null>(null)
onMounted(() => {
  const utterEls = document.querySelectorAll('.utterances')
  if (utterEls.length > 0) {
    utterEls.forEach((utterEl) => {
      document.body.removeChild(utterEl)
    })
  }
  commentContent.value?.appendChild(utterancesEL)
})
</script>

<template>
  <div ref="commentContent" class="comment-content" />
</template>
