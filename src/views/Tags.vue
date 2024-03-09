<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getTags } from '../api/index'
import type { Tag } from '../types/index'

const tags: Tag[] = reactive([])

onMounted(async () => {
  tags.push(...await getTags())
})
</script>

<template>
  <div>
    <ul class="list-none flex justify-center select-none text-gray-400 flex-wrap gap-x-2">
      <li v-for="tag in tags" :key="tag.id" class="group cursor-pointer hover:text-gray-600 position-relative rounded-full px-2 py-1 text-sm">
        <span>{{ tag.name }}</span>
        <span class="text-gray-300 align-super ml-0.4 font-size-2.4 group-hover:text-gray-400">{{ tag.count }}</span>
      </li>
    </ul>
  </div>
</template>
