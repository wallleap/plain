<script setup lang="ts">
import Header from './components/Header.vue'
import Copyright from './components/Copyright.vue'
</script>

<template>
  <Header />
  <router-view class="my-20 min-h-60vh" />
  <Copyright />
</template>
