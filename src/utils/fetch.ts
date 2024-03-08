const tempToken: string = import.meta.env.V_GITHUB_TOKEN
const GH_TOKEN: string = tempToken.split(', ').join('')
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
  try {
    const response = await fetch(url, options)
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}
