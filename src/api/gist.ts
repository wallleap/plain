import type { Gist, GistFiles } from '../types'

export type GistMethod = 'GET' | 'PATCH'

interface GistRequestOptions {
  gistId: string
  token: string
  method?: GistMethod
  body?: string
  fetchImpl?: typeof fetch
}

export class GistRequestError extends Error {
  readonly operation: GistMethod
  readonly status: number | null

  constructor(
    message: string,
    operation: GistMethod,
    status: number | null,
  ) {
    super(message)
    this.name = 'GistRequestError'
    this.operation = operation
    this.status = status
  }
}

function reportGistError(error: GistRequestError) {
  const status = error.status === null ? 'network/configuration' : error.status
  console.error(`[Gist ${error.operation}] request failed (status: ${status})`)
}

export async function requestGistWithConfig({
  gistId,
  token,
  method = 'GET',
  body,
  fetchImpl = fetch,
}: GistRequestOptions): Promise<GistFiles> {
  if (!gistId || !token) {
    const error = new GistRequestError('Gist configuration is incomplete', method, null)
    reportGistError(error)
    throw error
  }

  let response: Response
  try {
    response = await fetchImpl(`https://api.github.com/gists/${gistId}`, {
      method,
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body,
    })
  }
  catch {
    const error = new GistRequestError('Gist network request failed', method, null)
    reportGistError(error)
    throw error
  }

  if (!response.ok) {
    const error = new GistRequestError(`Gist request returned HTTP ${response.status}`, method, response.status)
    reportGistError(error)
    throw error
  }

  let result: unknown
  try {
    result = await response.json()
  }
  catch {
    const error = new GistRequestError('Gist response is not valid JSON', method, response.status)
    reportGistError(error)
    throw error
  }

  if (!result || typeof result !== 'object' || !('files' in result)) {
    const error = new GistRequestError('Gist response does not contain files', method, response.status)
    reportGistError(error)
    throw error
  }

  const files = (result as Gist).files
  if (!files || typeof files !== 'object' || Array.isArray(files)) {
    const error = new GistRequestError('Gist files response has an invalid shape', method, response.status)
    reportGistError(error)
    throw error
  }

  return files
}
