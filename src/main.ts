import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import 'highlight.js/styles/atom-one-light.min.css'
import './fix.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
  .use(pinia)
  .mount('#app')
