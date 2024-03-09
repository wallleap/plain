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
    bScript.async = true
    document.body.appendChild(bScript)
  }
})
</script>

<template>
  <div class="text-gray-600 about-page">
    <MarkdownIt :content="about" />
  </div>
</template>
