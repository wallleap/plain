<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import logo from '/logo.svg?raw'

const isDark = ref(false)
const themeStore = useThemeStore()
const route = useRoute()
const { t } = useI18n()
const activeClass = 'liquid'
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
  <header class="fixed left-0 right-0 top-2 z-999 mx-auto w-full flex select-none items-center justify-center line-height-none all:transition-200">
    <nav class="liquid flex items-center justify-start rd-full bg-[rgba(0,0,0,0.05)] px-0.6 pb-0.7 pt-0.5 dark:bg-[rgba(255,255,255,0.09)]">
      <a href="/" class="mr-8 inline-block h-5 w-5 cursor-pointer px-1 sm:px-4 xs:px-2 hover:brightness-10 dark:hover:brightness-180">
        <h1 class="m-0 h-100% p-0 align-middle font-size-2xl" v-html="logo" />
      </a>
      <ul class="m-0 flex select-none list-none items-center justify-center p-0 text-gray-500 all:transition-100">
        <li v-for="link in links" :key="link.id" class="m-0 flex flex-shrink-0 cursor-pointer items-center justify-center p-0">
          <router-link
            :to="link.link"
            class="h-9 flex flex-justify-center flex-items-center rd-full px-1 text-black/75 sm:px-4 xs:px-2 dark:text-white"
            :class="{ [activeClass]: route.path === link.link }"
            :style="{ backgroundColor: route.path === link.link ? 'rgba(0,0,0,0.08)' : 'transparent' }"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </nav>
    <ul
      class="liquid m-l-2 h-auto w-auto flex list-none items-center justify-start overflow-hidden rd-full bg-[rgba(0,0,0,0.05)] px-0.6 pb-0.7 pt-0.5 transition-all duration-200 dark:bg-[rgba(255,255,255,0.09)]"
      :class="{ 'w-9 h-9': route.path === '/search' }"
    >
      <li class="m-0 cursor-pointer p-0">
        <router-link
          to="/search"
          class="h-9 w-9 flex flex-justify-center flex-items-center rd-full text-black/75 dark:text-white"
        >
          <i class="fa-solid fa-magnifying-glass" />
        </router-link>
      </li>
      <li class="m-0 h-9 w-9 flex cursor-pointer items-center justify-center rd-full p-0" @click="changeTheme">
        <i v-if="!isDark" class="fa-solid fa-sun text-black/75 dark:text-white" />
        <i v-else class="fa-solid fa-moon text-black/75 dark:text-white" />
      </li>
    </ul>
  </header>
</template>
