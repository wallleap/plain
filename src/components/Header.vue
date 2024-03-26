<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import logo from '/logo.svg?raw'

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
  <header class="m-y-3 flex items-center justify-between line-height-none">
    <a href="/" class="inline-block h-6 w-6 cursor-pointer hover:brightness-10 dark:hover:brightness-180">
      <h1 class="m-0 h-100% p-0 align-middle font-size-2xl" v-html="logo" />
    </a>
    <nav class="m-0">
      <ul class="m-0 flex select-none list-none p-0 text-gray-500 all:transition-100">
        <li class="m-0 h-9 w-9 flex-shrink-0 cursor-pointer p-0">
          <router-link to="/tags" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-regular fa-bookmark" />
          </router-link>
        </li>
        <li class="m-0 h-9 w-9 flex-shrink-0 cursor-pointer p-0">
          <router-link to="/about" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-bullseye" />
          </router-link>
        </li>
        <li class="m-0 h-9 w-9 flex-shrink-0 cursor-pointer p-0">
          <router-link to="/friend" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-link" />
          </router-link>
        </li>
        <li class="m-0 h-9 w-9 flex-shrink-0 cursor-pointer p-0">
          <router-link to="/search" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-magnifying-glass" />
          </router-link>
        </li>
        <li class="m-0 h-9 w-9 flex flex-shrink-0 cursor-pointer flex-justify-center flex-items-center rd-100 p-0 hover:text-gray-700 dark:hover:text-gray-200" @click="toggleDark">
          <i v-if="!isDark" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </li>
      </ul>
    </nav>
  </header>
</template>
