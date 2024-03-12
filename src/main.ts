import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import './fix.css'
import { createPinia } from 'pinia'
import AV from 'leancloud-storage'
import App from './App.vue'
import router from './router'

AV.init({
  appId: import.meta.env.V_LEANCLOUD_ID,
  appKey: import.meta.env.V_LEANCLOUD_KEY,
  serverURL: import.meta.env.V_LEANCLOUD_SERVER,
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
  .use(pinia)
  .mount('#app')
