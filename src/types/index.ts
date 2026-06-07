// GitHub
// Issue
export interface IssueLabel {
  id: number
  color: string
  name: string
}
export interface IssueMilestone {
  id: number
  title: string
}
export interface Issue {
  id: number
  body: string
  comments: number
  comments_url: string
  created_at: string
  labels: IssueLabel[]
  milestone: IssueMilestone
  number: number
  title: string
  updated_at: string
}
export type IssueResponse = Issue[]
export interface IssueSearchResponse {
  total_count: number
  items: Issue[]
}

// Gist
export interface Gist {
  id: number
  files: Record<string, {
    content: string
  }>
}

// Post
export interface Post {
  id: number
  title: string
  times: number
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

// Friend
export interface Friend {
  name: string
  avatar: string
  url: string
  desc: string
  tag: {
    name: string
    color: string
    bg: string
  }
}

// Tag
export interface Tag {
  id: number
  name: string
  count: number
}
