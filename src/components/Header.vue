<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'

const title = import.meta.env.V_TITLE
const isDark = ref(false)
const themeStore = useThemeStore()

document.documentElement.dataset.theme = themeStore.curTheme
isDark.value = themeStore.curTheme !== 'light'

function toggleDark() {
  const cTheme = themeStore.curTheme === 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = cTheme
  themeStore.toggleTheme(cTheme)
  isDark.value = !isDark.value
}
</script>

<template>
  <header class="m-y-3 line-height-none flex justify-between items-center">
    <h1 class="p-0 m-0 font-size-2xl align-middle">
      <router-link to="/" class="cursor-pointer">
        {{ title }}
      </router-link>
    </h1>
    <nav class="m-0">
      <ul class="list-none p-0 m-0 text-gray-500 flex select-none all:transition-100">
        <li class="p-0 m-0 flex-shrink-0 h-9 w-9 cursor-pointer">
          <router-link to="/tags" class="rd-100 flex h-100% w-100% flex-justify-center flex-items-center hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-regular fa-bookmark" />
          </router-link>
        </li>
        <li class="p-0 m-0 flex-shrink-0 h-9 w-9 cursor-pointer">
          <router-link to="/about" class="rd-100 flex h-100% w-100% flex-justify-center flex-items-center hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-bullseye" />
          </router-link>
        </li>
        <li class="p-0 m-0 flex-shrink-0 h-9 w-9 cursor-pointer">
          <router-link to="/friend" class="rd-100 flex h-100% w-100% flex-justify-center flex-items-center hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-link" />
          </router-link>
        </li>
        <li class="p-0 m-0 flex-shrink-0 h-9 w-9 cursor-pointer">
          <router-link to="/search" class="rd-100 flex h-100% w-100% flex-justify-center flex-items-center hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-magnifying-glass" />
          </router-link>
        </li>
        <li class="p-0 m-0 rd-100 flex flex-shrink-0 h-9 w-9 cursor-pointer flex-justify-center flex-items-center hover:text-gray-700 dark:hover:text-gray-200" @click="toggleDark">
          <i v-if="!isDark" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </li>
      </ul>
    </nav>
  </header>
</template>
