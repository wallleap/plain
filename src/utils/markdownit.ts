import markdownit from 'markdown-it'
import markdownitsub from 'markdown-it-sub'
import markdownitsup from 'markdown-it-sup'
import markdownitins from 'markdown-it-ins'
import markdownitmark from 'markdown-it-mark'
import markdownitfootenote from 'markdown-it-footnote'
import markdownittasklists from 'markdown-it-task-lists'
import { full as markdownitemoji } from 'markdown-it-emoji'
import hljs from 'highlight.js'

export const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(str, lang): string {
    if (lang?.toLowerCase() === 'vue')
      lang = 'html'
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      }
      catch (__) {}
    }

    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  },
}).use(markdownitsub)
  .use(markdownitsup)
  .use(markdownitins)
  .use(markdownitmark)
  .use(markdownitfootenote)
  .use(markdownittasklists)
  .use(markdownitemoji)
