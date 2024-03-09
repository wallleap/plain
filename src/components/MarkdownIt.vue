<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { md } from '../utils/markdownit'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
const parsedContent = ref('')
watchEffect(() => {
  parsedContent.value = md.render(props.content)
})
</script>

<template>
  <div v-html="parsedContent" />
</template>
