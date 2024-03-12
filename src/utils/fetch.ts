const tempToken: string = import.meta.env.V_GITHUB_TOKEN
const GH_TOKEN = tempToken.split(', ').join('')
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
export async function fetchWithToken(url: string, options: RequestInit = { ...ghOpt }) {
  const requestUrl = url.startsWith('http') ? url : `${GH_API}${url}`
  try {
    const response = await fetch(requestUrl, options)
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('Error occurs at fetch Issues,', error)
    return null
  }
}
