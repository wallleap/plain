import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * ref()s become state properties
 * computed()s become getters
 * function()s become actions
 * */
export const useThemeStore = defineStore('theme', () => {
  const curTheme = ref('light')
  if (!localStorage.getItem('theme'))
    localStorage.setItem('theme', 'light')
  curTheme.value = localStorage.getItem('theme') as string
  function toggleTheme(t = 'light') {
    curTheme.value = t
    localStorage.setItem('theme', curTheme.value)
  }
  return { curTheme, toggleTheme }
})
