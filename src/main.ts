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

// 初始化 LeanCloud
if (import.meta.env.V_LEANCLOUD_ID && import.meta.env.V_LEANCLOUD_KEY && import.meta.env.V_LEANCLOUD_SERVER) {
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

const pinia = createPinia()

const app = createApp(App)
app.use(directives)
  .use(router)
  .use(pinia)
  .mount('#app')
