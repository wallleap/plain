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

/**
 * 检测字符串是否为合规的 JSON 格式
 * @param {string} jsonStr 待检测的 JSON 字符串
 * @param {object} [options] 可选配置项
 * @param {boolean} [options.allowSingleQuotes] 是否允许单引号（默认不允许，严格遵循 JSON 规范）
 * @param {boolean} [options.allowTrailingComma] 是否允许末尾逗号（默认不允许）
 * @returns {object} 检测结果
 * @property {boolean} isValid - 是否为合法 JSON
 * @property {any} [parsedData] - 解析后的 JSON 数据（仅 isValid 为 true 时存在）
 * @property {string} [errorMessage] - 错误信息（仅 isValid 为 false 时存在）
 * @property {string} [errorType] - 错误类型（仅 isValid 为 false 时存在，如：SYNTAX_ERROR、INVALID_TYPE 等）
 */
export function isValidJSON(jsonStr: string, options = {}) {
  // 默认配置
  const config = {
    allowSingleQuotes: false,
    allowTrailingComma: false,
    ...options,
  }

  // 空值校验
  if (typeof jsonStr !== 'string') {
    return {
      isValid: false,
      errorMessage: '输入不是字符串类型',
      errorType: 'INVALID_INPUT_TYPE',
    }
  }

  // 去除首尾空白字符
  const trimmedStr = jsonStr.trim()

  // 空字符串校验
  if (trimmedStr === '') {
    return {
      isValid: false,
      errorMessage: '输入是空字符串',
      errorType: 'EMPTY_STRING',
    }
  }

  // 预处理：如果允许单引号，先替换为双引号（注意避免替换字符串内的单引号）
  let processedStr = trimmedStr
  if (config.allowSingleQuotes) {
    // 正则替换：仅替换键和值外层的单引号（简单处理，复杂场景可优化）
    processedStr = processedStr
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // 替换键的单引号
      .replace(/: (['"])(.*?)\1(?=[,}\]])/g, ': "$2"') // 替换值的单引号
  }

  // 预处理：如果允许末尾逗号，移除末尾逗号
  if (config.allowTrailingComma) {
    processedStr = processedStr
      .replace(/,\s*}/g, '}') // 移除对象末尾逗号
      .replace(/,\s*]/g, ']') // 移除数组末尾逗号
  }

  try {
    // 尝试解析 JSON
    const parsedData = JSON.parse(processedStr)

    return {
      isValid: true,
      parsedData,
    }
  }
  catch (error) {
    // 解析失败，返回详细错误信息
    const originalError = error as Error
    let errorType = 'SYNTAX_ERROR'
    let errorMsg = `JSON 语法错误：${originalError.message}`

    // 细化错误类型提示
    if (originalError.message.includes('Unexpected token')) {
      errorType = 'UNEXPECTED_TOKEN'
      errorMsg = `JSON 包含非法字符：${originalError.message.split(':')[1]?.trim() || '未知字符'}`
    }
    else if (originalError.message.includes('Unexpected end of JSON input')) {
      errorType = 'UNEXPECTED_END'
      errorMsg = 'JSON 字符串不完整（可能缺少闭合的 } 或 ]）'
    }

    return {
      isValid: false,
      errorMessage: errorMsg,
      errorType,
      originalError, // 保留原始错误对象（可选）
    }
  }
}

/**
 * 检测是否是一个有效的友链 JSON 字符串
 * @returns true or false
 */
export function isSpecificJSONFormat(str: string) {
  if (/^[\{\[]/.test(str) && /[\}\]]$/.test(str)) {
    try {
      const obj = JSON.parse(str)

      if (typeof obj !== 'object' || obj === null)
        return false

      if (
        typeof obj.name !== 'string'
        || typeof obj.url !== 'string'
        || typeof obj.avatar !== 'string'
        || typeof obj.desc !== 'string'
        || typeof obj.tag !== 'object'
        || obj.tag === null
      )
        return false

      if (
        typeof obj.tag.name !== 'string'
        || typeof obj.tag.color !== 'string'
        || typeof obj.tag.bg !== 'string'
      )
        return false

      return true
    }
    catch (error) {
      return false
    }
  }
  return false
}

/**
 * 获取浏览器语言
 * @description 根据浏览器语言设置语言
 * @returns 'zh-CN' or 'en-US'
 */
export function getBrowserLocale() {
  const STORAGE_KEY = 'CURRENT_LOCALE'
  const storageLocale = localStorage.getItem(STORAGE_KEY) || ''
  const browserLocale = navigator.language
  const browserLocaleLower = browserLocale.toLowerCase()
  const hasZh = (lang: string) => lang.includes('zh')

  // 先检查 localStorage 中的语言设置
  if (hasZh(storageLocale)) {
    document.documentElement.lang = 'zh-CN'
    return 'zh-CN'
  }

  if (hasZh(browserLocaleLower)) {
    document.documentElement.lang = 'zh-CN'
    return 'zh-CN'
  }

  document.documentElement.lang = 'en-US'
  return 'en-US'
}

/**
 * 生成符合 RFC 4122 标准的 UUID v4
 * @returns 标准 UUID 字符串
 */
export function generateUUID(): string {
  // 生成16字节的随机数组
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)

  // 修正版本位（第6字节，设置为0100，对应版本4）
  array[6] = (array[6] & 0x0F) | 0x40
  // 修正变体位（第8字节，设置为10xx，符合RFC 4122）
  array[8] = (array[8] & 0x3F) | 0x80

  // 转换为十六进制并格式化
  return Array.from(array, byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5')
}
