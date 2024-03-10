<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from '../utils/index'

/*
 * 当滚动到 300px 并且向上滚动时显示
 * */
const showBackTop = ref(false)
const prevScrollTop = ref(0)
const scrollTop = ref(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
function handleScroll() {
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop.value > 300 && scrollTop.value < prevScrollTop.value)
    showBackTop.value = true
  else
    showBackTop.value = false
  prevScrollTop.value = scrollTop.value
}
const debouncedHandleScroll = debounce(handleScroll, 100)
document.addEventListener('scroll', debouncedHandleScroll)

/*
 * 点击回到顶部
 * */
function backTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="pos-fixed bottom-6 right-6 flex cursor-pointer select-none justify-center flex-items-center text-gray-400 hover:text-gray-600 all:transition-400 dark:hover:text-gray-200">
    <div v-show="showBackTop" class="h-10 w-10 flex justify-center flex-items-center border-rd-100vh hover:bg-gray-100 dark:hover:bg-gray-500" @click="backTop">
      <i class="fa-solid fa-arrow-up" />
    </div>
  </div>
</template>
