<script setup lang="ts">
import { ref } from 'vue'

const title = import.meta.env.V_TITLE
const isDark = ref(false)
</script>

<template>
  <header class="flex flex-items-center flex-justify-between m-y-3 line-height-none">
    <h1 class="m-0 p-0">
      <router-link to="/" class="cursor-pointer text-2xl">
        {{ title }}
      </router-link>
    </h1>
    <nav class="m-0">
      <ul class="flex m-0 p-0 list-none text-gray-500 select-none all:transition-100">
        <li class="cursor-pointer flex-shrink-0 w-9 h-9">
          <router-link to="/tags" class="flex flex-items-center flex-justify-center w-100% h-100% rd-100 hover:text-gray-700 hover:bg-gray-100">
            <i class="fa-regular fa-bookmark" />
          </router-link>
        </li>
        <li class="cursor-pointer flex-shrink-0 w-9 h-9">
          <router-link to="/about" class="flex flex-items-center flex-justify-center w-100% h-100% rd-100 hover:bg-gray-100 hover:text-gray-700">
            <i class="fa-solid fa-bullseye" />
          </router-link>
        </li>
        <li class="cursor-pointer flex-shrink-0 w-9 h-9">
          <router-link to="/friends" class="flex flex-items-center flex-justify-center w-100% h-100% rd-100 hover:bg-gray-100 hover:text-gray-700">
            <i class="fa-solid fa-link" />
          </router-link>
        </li>
        <li class="cursor-pointer flex-shrink-0 w-9 h-9">
          <router-link to="/search" class="flex flex-items-center flex-justify-center w-100% h-100% rd-100 hover:bg-gray-100 hover:text-gray-700">
            <i class="fa-solid fa-magnifying-glass" />
          </router-link>
        </li>
        <li class="flex flex-items-center flex-justify-center cursor-pointer flex-shrink-0 w-9 h-9 rd-100 hover:bg-gray-100 hover:text-gray-700" @click="isDark = !isDark">
          <i v-if="!isDark" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </li>
      </ul>
    </nav>
  </header>
</template>
