<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue'
import { md } from '../utils/markdownit'

interface Toc {
  anchor: string
  content: string
}
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  renderToc: {
    type: Boolean,
    default: false,
  },
})
const parsedContent = ref('')
watchEffect(() => {
  parsedContent.value = md.render(props.content, {
    tocCallback(_tocMarkdown: string, _tocArray: Toc[], tocHtml: string) {
      if (tocHtml && props.renderToc) {
        const tocWrap = document.createElement('nav')
        tocWrap.id = 'toc-wrapper'
        const tocWrapEl = document.querySelector('#toc-wrapper')
        if (tocWrapEl)
          tocWrapEl.remove()
        tocWrap.innerHTML = tocHtml
        document.body.appendChild(tocWrap)
      }
    },
  })
})

onBeforeUnmount(() => {
  const tocWrapEl = document.querySelector('#toc-wrapper')
  if (tocWrapEl)
    tocWrapEl.remove()
})
</script>

<template>
  <main class="markdown-body" v-html="parsedContent" />
</template>
