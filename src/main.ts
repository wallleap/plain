import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
  .mount('#app')
