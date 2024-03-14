# plain - GitHub Issue API Blog Theme

This is a Vue 3 composition API based theme for [GitHub Issue API](https://docs.github.com/en/rest). It can help you build a blog with GitHub Issue API.

![preview-如果图片不显示请复制图片链接后获取仓库和路径前往查看](https://raw.githubusercontent.com/wallleap/imgs/main/plain/plain-mockup.webp)

## How to use

1. Clone this repository --> `git clone https://github.com/wallleap/plain.git` or `git clone git@github.com:wallleap/plain.git`.
2. Install dependencies `pnpm i`
3. Run `pnpm dev` to start the development server
4. Rename `.env.sample` to `.env.local`, and fill in the configuration --> [some configuration](https://github.com/wallleap/imgs/blob/main/plain/config.md).
5. Go to GitHub and create a repo, named `myblogs`, then new issues in the repo to generate the blog/friends. For more details, you can see [new issues](https://github.com/wallleap/imgs/blob/main/plain/new-issue.md).
6. Run `pnpm build` to build the project for production.
7. Deploy to GitHub Pages/Netlify/Vercel/Your Server etc.
8. Go to the website and enjoy it.

## Thanks

- [Vite](https://vitejs.dev/)
- [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [husky](https://github.com/typicode/husky)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [UnoCSS](https://github.com/unocss/unocss)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [front-matter](https://www.npmjs.com/package/front-matter)
- [highlight.js](https://highlightjs.org/)
- [LeanCloud Storage](https://docs.leancloud.cn/sdk/storage/guide/setup-js/)
- [GitHub Issue API](https://docs.github.com/en/rest)

## License

[MIT](https://github.com/wallleap/plain/blob/main/LICENSE)
