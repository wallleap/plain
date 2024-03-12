// index.ts
import type { App } from 'vue'

export default async function directives(app: App) {
  // 项目是用 vite 创建，import.meta.glob 用于导入 /modules 下所有指令实现代码
  const files = import.meta.glob('./modules/*.ts')
  for (const key in files) {
    const file: any = await files[key]()
    if (file) {
      //  as DirectiveOptions<Keys>
      const direct = file.default
      const name = key.replace(/\.\/modules\//, '').replace(/\.ts$/, '')
      app.directive(name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), direct)
    }
  }
}
