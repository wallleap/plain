import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import { createPinia } from 'pinia'
import AV from 'leancloud-storage'
import directives from './directives/index'
import App from './App.vue'
import router from './router'
import './custom.css'
import { createNotify } from './services/notifyService'
import { useLeanCloudStore } from './stores/leanCloud'

const pinia = createPinia()

const app = createApp(App)
app.use(directives)
  .use(router)
  .use(pinia)
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
else {
  createNotify({
    message: 'LeanCloud 未正确配置，阅读量统计功能将无法正常使用',
    type: 'error',
    duration: 3000,
  })
}
