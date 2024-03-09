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
      <li v-for="tag in tags" :key="tag.id" class="group cursor-pointer position-relative rounded-full hover:text-gray-600 px-2 py-1 text-sm">
        <span>{{ tag.name }}</span>
        <span class="text-gray-300 font-size-2.4 align-super ml-0.4 group-hover:text-gray-400">{{ tag.count }}</span>
      </li>
    </ul>
  </div>
</template>
