/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 * @returns 返回一个函数，调用时，会延迟 delay 毫秒执行 func
 * @example
 * const fn = debounce(() => {
 *   console.log('执行了')
 * }, 1000)
 * fn()
 */
export function debounce<F extends (...args: any[]) => void>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timerId: number | undefined

  return function (this: ThisParameterType<F>, ...args) {
    clearTimeout(timerId)

    timerId = window.setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 将十六进制颜色值转换为 hsl 颜色值
 * @param hex 十六进制颜色值
 * @returns hsl 数组，[h, s%, l%]，需要自己添加 %
 * @example
 * console.log(hexToHSL('#ff0000')) // [0, 100%, 50%]
 */
export function hexToHSL(hex: string) {
  let r = 0
  let g = 0
  let b = 0
  if (hex.length === 4) {
    r = Number(`0x${hex[1]}${hex[1]}`)
    g = Number(`0x${hex[2]}${hex[2]}`)
    b = Number(`0x${hex[3]}${hex[3]}`)
  }
  else if (hex.length === 7) {
    r = Number(`0x${hex[1]}${hex[2]}`)
    g = Number(`0x${hex[3]}${hex[4]}`)
    b = Number(`0x${hex[5]}${hex[6]}`)
  }
  // 将 RGB 转换为十进制
  r /= 255
  g /= 255
  b /= 255

  // 找出最大和最小的颜色值
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        h = 0
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}
