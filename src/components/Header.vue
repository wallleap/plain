<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../stores/theme'
import logo from '/logo.svg?raw'

const isDark = ref(false)
const themeStore = useThemeStore()
const { t } = useI18n()
const links = [
  {
    id: 1,
    name: t('nav.posts'),
    link: '/posts',
  },
  {
    id: 2,
    name: t('nav.tags'),
    link: '/tags',
  },
  {
    id: 3,
    name: t('nav.friends'),
    link: '/friend',
  },
]

document.documentElement.dataset.theme = themeStore.curTheme
isDark.value = themeStore.curTheme !== 'light'

function toggleDark() {
  const cTheme = themeStore.curTheme === 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = cTheme
  themeStore.toggleTheme(cTheme)
  isDark.value = !isDark.value
}

function changeTheme(event: MouseEvent) {
  if (!document.startViewTransition || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true) {
    toggleDark()
    return
  }
  const transition = document.startViewTransition(() => {
    toggleDark()
  })

  const x = event?.clientX ?? window.innerWidth
  const y = event?.clientY ?? 0
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate({
      clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
    }, {
      duration: 500,
      easing: 'ease-in',
      pseudoElement: isDark.value
        ? '::view-transition-new(root)'
        : '::view-transition-old(root)',
    })
  })
}
</script>

<template>
  <header class="m-y-3 flex items-center justify-between line-height-none">
    <a href="/" class="inline-block h-6 w-6 cursor-pointer hover:brightness-10 dark:hover:brightness-180">
      <h1 class="m-0 h-100% p-0 align-middle font-size-2xl" v-html="logo" />
    </a>
    <nav class="m-0 flex">
      <ul class="m-0 flex select-none list-none items-center justify-center gap-4 p-0 text-gray-500 all:transition-100">
        <li v-for="link in links" :key="link.id" class="m-0 h-9 flex-shrink-0 cursor-pointer p-0">
          <router-link :to="link.link" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            {{ link.name }}
          </router-link>
        </li>
      </ul>
      <ul class="m-0 m-l-2 flex select-none list-none items-center justify-center p-0 text-gray-500 all:transition-100">
        <li class="m-0 h-9 w-9 flex-shrink-0 cursor-pointer p-0">
          <router-link to="/search" class="search-btn h-100% w-100% flex flex-justify-center flex-items-center rd-100 hover:text-gray-700 dark:hover:text-gray-200">
            <i class="fa-solid fa-magnifying-glass" />
          </router-link>
        </li>
        <li class="m-0 h-9 w-9 flex flex-shrink-0 cursor-pointer flex-justify-center flex-items-center rd-100 p-0 hover:text-gray-700 dark:hover:text-gray-200" @click="changeTheme">
          <i v-if="!isDark" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </li>
      </ul>
    </nav>
  </header>
</template>
