// 不想引入的
declare module 'markdown-it-toc-and-anchor' {
  export default function () {}
}
declare module 'markdown-it-sub' {
  export default function () {}
}
declare module 'markdown-it-sup' {
  export default function () {}
}
declare module 'markdown-it-ins' {
  export default function () {}
}
declare module 'markdown-it-mark' {
  export default function () {}
}
declare module 'markdown-it-footnote' {
  export default function () {}
}
declare module 'markdown-it-task-lists' {
  export default function () {}
}
declare module 'markdown-it-emoji' {
  export const full
}

declare module 'vue3-seamless-scroll' {
  export const Vue3SeamlessScroll: import('vue').DefineComponent < OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType, OptionsType >

  const install: (app: import('vue').App, options: {
    name: string
  }) => unknown
  export default install
}

interface Document {
  startViewTransition: (
    callback: () => void
  ) => ready
}
