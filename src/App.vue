<script setup lang="ts">
import Header from './components/Header.vue'
import Copyright from './components/Copyright.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <Header />
  <div class="my-20 min-h-60vh">
    <router-view class="all:transition-150" />
  </div>
  <Copyright />
  <BackToTop />
</template>
