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
  <div class="flex flex-items-center select-none cursor-pointer text-gray-400 justify-center hover:text-gray-600 pos-fixed bottom-6 right-6 all:transition-400">
    <div v-show="showBackTop" class="flex flex-items-center justify-center hover:bg-gray-100 w-10 h-10 border-rd-100vh" @click="backTop">
      <i class="fa-solid fa-arrow-up" />
    </div>
  </div>
</template>
