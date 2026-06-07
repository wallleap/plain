import fm from 'front-matter'
import type { Friend, Issue, Post } from '../types'

// 格式化日期
export function formatDate(date: string) {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}-${month}-${day}`
}

/*
 * 格式化文章内容
 * */
type TempBody = Pick<Post, 'title' | 'summary' | 'body' | 'date' | 'updated'>
const annotationRegex = /^(.+)?\r\n\s*(.+)?\r\n/
const markReg = /^\[(.+)\]: # '[^']*'?\r\n/
const firstLineReg = /^(.+)?\s+/
const frontMatterReg = /^---\s+.*\s+---/s
function formatBody(body: string) {
  const obj: TempBody = {
    title: '',
    summary: '',
    body,
    date: '',
    updated: '',
  }
  // 有 front matter
  if (frontMatterReg.test(obj.body)) {
    const frontMatter = fm<TempBody>(obj.body)
    if (frontMatter.attributes) {
      const { title, date, updated } = frontMatter.attributes
      obj.title = title
      obj.date = date
      obj.updated = updated
    }
    if (frontMatter.body)
      obj.body = frontMatter.body
  }
  const firstLineResult = firstLineReg.exec(obj.body)
  if (firstLineResult?.[1]) {
    obj.summary = firstLineResult[1]
    if (markReg.test(obj.body)) {
      const annotationResult = annotationRegex.exec(obj.body)
      if (annotationResult?.[2])
        obj.summary = annotationResult[2]
    }
  }
  return obj
}

/*
 * 格式化文章列表
 * */
export function formatPost(issue: Issue): Post {
  const { id, title, comments, comments_url, created_at, updated_at, labels, body, milestone, number } = issue
  const obj = formatBody(body)
  const post = {
    id,
    times: 1,
    title: obj.title || title,
    date: obj.date ? formatDate(obj.date) : formatDate(created_at),
    updated: obj.updated ? formatDate(obj.updated) : formatDate(updated_at),
    comments,
    comments_url,
    labels,
    milestone,
    summary: obj.summary,
    body: obj.body,
    num: number,
  }
  return post
}

/*
 * 格式化友链
 * */
export function formatFriend(friend: Issue): Friend {
  const { body, labels } = friend
  const tag = {
    name: labels?.[0]?.name || '',
    color: labels?.[0]?.color || '',
    bg: '',
  }
  const regex = /^name:\s(.*)\r\nurl:\s(.*)\r\navatar:\s(.*)\r\ndesc:\s(.*)$/
  const result = regex.exec(body)
  if (!result) {
    return {
      name: '',
      url: '#',
      avatar: '',
      desc: '',
      tag,
    }
  }

  const [, name, url, avatar, desc] = result
  return {
    name,
    url,
    avatar,
    desc,
    tag,
  }
}
