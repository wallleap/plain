import { createI18n } from 'vue-i18n'
import { getBrowserLocale } from '../utils'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
})

export default i18n
