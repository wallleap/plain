import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import { createPinia } from 'pinia'
import AV from 'leancloud-storage'
import directives from './directives/index'
import App from './App.vue'
import router from './router'
import i18n from './locale'
import './custom.css'
import { useLeanCloudStore } from './stores/leanCloud'

const pinia = createPinia()

const app = createApp(App)
app.use(directives)
  .use(router)
  .use(pinia)
  .use(i18n)
  .mount('#app')

const { needLeanCloud } = useLeanCloudStore()

// 初始化 LeanCloud
if (needLeanCloud) {
  AV.init({
    appId: import.meta.env.V_LEANCLOUD_ID,
    appKey: import.meta.env.V_LEANCLOUD_KEY,
    serverURL: import.meta.env.V_LEANCLOUD_SERVER,
  })
}
