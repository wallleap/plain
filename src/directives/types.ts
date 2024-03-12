import type { Directive } from 'vue'

type EventTypes = 'click' | 'input'

export interface ELType extends HTMLElement {
  __fn__: () => any
}

export interface Directives {
  vFocus: Directive // 聚焦
  vDebounce: Directive<
    any,
    {
      type?: EventTypes
      delay?: number
      callback: (...args: any[]) => void
    }
  > // 防抖
}

export type Keys = keyof Directives

// 指令名转小写
type LowerDirectiveName<T extends Keys> = T extends `v${infer V}`
  ? Lowercase<V>
  : never

// 指令对象类型
export interface DirectiveOptions<T extends Keys> {
  name: LowerDirectiveName<T>
  directive: Directives[T]
}
