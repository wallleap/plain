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
  <div class="flex flex-items-center justify-center pos-fixed bottom-6 right-6 select-none cursor-pointer text-gray-400 all:transition-400 hover:text-gray-600">
    <div v-show="showBackTop" class="flex flex-items-center justify-center border-rd-100vh w-10 h-10 hover:bg-gray-100" @click="backTop">
      <i class="fa-solid fa-arrow-up" />
    </div>
  </div>
</template>
