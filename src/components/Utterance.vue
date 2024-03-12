<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useThemeStore } from '../stores/theme'

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

const props = defineProps({
  uttScript: { type: String, required: true },
})
const themeStore = useThemeStore()
// parse utterances code
const script = props.uttScript
const utterancesOpts: UTTERANCES_OPTS = computed(() => {
  const scriptTag = script
  const regex = /(\w+)\s*=\s*["']([^"']+)["']/g
  const matches = scriptTag?.match(regex)
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

const localTheme = ref('light')
const commentContent = ref<HTMLDivElement | null>(null)

watchEffect(() => {
  localTheme.value = themeStore.curTheme
  // create utterances script
  const utterancesEL = document.createElement('script')
  utterancesEL.async = utterancesOpts.value.async || false
  utterancesEL.setAttribute('src', utterancesOpts.value.src || 'https://utteranc.es/client.js')
  utterancesEL.setAttribute('repo', utterancesOpts.value.repo)
  utterancesEL.setAttribute('issue-term', utterancesOpts.value.term)
  if (utterancesOpts.value.label !== '')
    utterancesEL.setAttribute('label', utterancesOpts.value.label)
  utterancesEL.setAttribute('crossorigin', utterancesOpts.value.crossorigin || 'anonymous')
  if (localTheme.value && localTheme.value === 'dark')
    utterancesEL.setAttribute('theme', 'github-dark')
  else
    utterancesEL.setAttribute('theme', utterancesOpts.value.theme)
  const utterEls = document.querySelectorAll('.utterances')
  if (utterEls.length > 0) {
    utterEls.forEach((utterEl) => {
      utterEl.remove()
    })
  }
  commentContent.value?.appendChild(utterancesEL)
})
</script>

<template>
  <div ref="commentContent" class="comment-content" />
</template>
