<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAbout } from '../api/index'

const about = ref('')

onMounted(async () => {
  about.value = await getAbout()
})
</script>

<template>
  <!-- TODO: Markdown 渲染 -->
  <div class="text-gray-600">
    {{ about }}
  </div>
</template>
