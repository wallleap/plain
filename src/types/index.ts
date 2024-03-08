// Post
export interface Post {
  id: number
  title: string
  summary: string
  body: string
  comments: number
  comments_url: string
  date: string
  updated: string
  labels: {
    id: number
    name: string
  }[]
  milestone: {
    id: number
    title: string
  }
  num: number
}
