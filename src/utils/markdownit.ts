import markdownIt from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItFootNote from 'markdown-it-footnote'
import markdownItTasklists from 'markdown-it-task-lists'
import { full as markdownItEmoji } from 'markdown-it-emoji'
import hljs from 'highlight.js'

export const md = markdownIt({
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
}).use(markdownItTocAndAnchor)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItFootNote)
  .use(markdownItTasklists)
  .use(markdownItEmoji)
