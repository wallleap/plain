<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAbout } from '../api/index'
import MarkdownIt from '../components/MarkdownIt.vue'

const about = ref('')
const bUrl = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'

onMounted(async () => {
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
</script>

<template>
  <div v-if="about" class="about-page text-gray-600 slide-enter-1 dark:text-gray-300">
    <MarkdownIt :content="about" />
  </div>
  <p v-else class="animate-blink animate-iteration-infinite text-center font-size-4 text-gray-400">
    页面加载中...
  </p>
</template>
