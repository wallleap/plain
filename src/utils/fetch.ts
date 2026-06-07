import { createNotify } from '../services/notifyService'

const tempToken: string = import.meta.env.V_GITHUB_TOKEN

if (!tempToken) {
  createNotify({
    message: '必须配置 GitHub Token',
    type: 'error',
    duration: 8000,
  })
}

const GH_TOKEN = tempToken?.split(', ')?.join('')
const GH_API = 'https://api.github.com'
const ghOpt = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${GH_TOKEN}`,
  },
}

/*
 * 获取数据（携带 GitHub Token）
 * */
export async function fetchWithToken<T>(url: string, options?: RequestInit): Promise<T | null> {
  const requestUrl = url.startsWith('http') ? url : `${GH_API}${url}`
  try {
    const response = await fetch(requestUrl, { ...ghOpt, ...options })
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    return response.json() as Promise<T>
  }
  catch (error) {
    console.error(`Error occurs at fetchWithToken ${requestUrl}`, error)
    return null
  }
}
