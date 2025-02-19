import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLeanCloudStore = defineStore('leanCloud', () => {
  const needLeanCloud = ref(false)

  needLeanCloud.value = !!((import.meta.env.V_LEANCLOUD_ID && import.meta.env.V_LEANCLOUD_KEY && import.meta.env.V_LEANCLOUD_SERVER))

  return { needLeanCloud }
})
