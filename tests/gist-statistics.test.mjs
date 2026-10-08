/* eslint-disable test/no-import-node-test */
import assert from 'node:assert/strict'
import test from 'node:test'
import { GistRequestError, requestGistWithConfig } from '../src/api/gist.ts'
import {
  assertCountersNotRegressed,
  assertVisitorsNotRegressed,
  isCounterData,
  isVisitorData,
  parseGistStatisticsFile,
} from '../src/stores/viewsData.ts'

const timestamp = '2026-10-08T01:00:00.000Z'
const counter = {
  id: 1,
  title: 'Post',
  times: 2,
  site: 'https://example.com/posts/1',
  createdAt: timestamp,
  updatedAt: timestamp,
}
const visitor = {
  referrer: '直接访问',
  totalVisitTimes: 2,
  uvCount: 1,
  visitors: [{
    ua: 'test',
    ip: '127.0.0.1',
    id: 'visitor-id',
    visitedTimes: 2,
    firstVisitedAt: timestamp,
    lastVisitedAt: timestamp,
  }],
  createdAt: timestamp,
  updatedAt: timestamp,
}

function response(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

test('Gist GET reports every relevant HTTP failure explicitly', async (context) => {
  const originalConsoleError = console.error
  console.error = () => {}
  context.after(() => {
    console.error = originalConsoleError
  })

  for (const status of [401, 403, 404, 429, 500]) {
    await context.test(`HTTP ${status}`, async () => {
      let calls = 0
      const fetchImpl = async (_url, options) => {
        calls += 1
        assert.equal(options.method, 'GET')
        return response(status, { message: 'failure' })
      }

      await assert.rejects(
        requestGistWithConfig({ gistId: 'gist', token: 'token', fetchImpl }),
        error => (
          error instanceof GistRequestError
          && error.operation === 'GET'
          && error.status === status
        ),
      )
      assert.equal(calls, 1)
    })
  }
})

test('Gist network failure rejects instead of returning empty files', async () => {
  const originalConsoleError = console.error
  console.error = () => {}
  try {
    await assert.rejects(
      requestGistWithConfig({
        gistId: 'gist',
        token: 'token',
        fetchImpl: async () => { throw new TypeError('timeout') },
      }),
      error => error instanceof GistRequestError && error.status === null,
    )
  }
  finally {
    console.error = originalConsoleError
  }
})

test('Gist PATCH returns files only after a successful response', async () => {
  const files = {
    'counter.json': { content: JSON.stringify([counter]), truncated: false },
  }
  const result = await requestGistWithConfig({
    gistId: 'gist',
    token: 'token',
    method: 'PATCH',
    body: '{"files":{}}',
    fetchImpl: async (_url, options) => {
      assert.equal(options.method, 'PATCH')
      return response(200, { files })
    },
  })
  assert.deepEqual(result, files)
})

test('statistics files distinguish valid empty arrays from missing or damaged data', () => {
  assert.deepEqual(
    parseGistStatisticsFile({ content: '[]', truncated: false }, isCounterData, 'counter.json'),
    [],
  )
  assert.throws(() => parseGistStatisticsFile(undefined, isCounterData, 'counter.json'), /missing/)
  assert.throws(
    () => parseGistStatisticsFile({ content: '[]', truncated: true }, isCounterData, 'counter.json'),
    /truncated/,
  )
  assert.throws(
    () => parseGistStatisticsFile({ content: '[{"id":1}' }, isCounterData, 'counter.json'),
    /invalid or truncated JSON/,
  )
})

test('counter and visitor structures are validated beyond JSON syntax', () => {
  assert.equal(isCounterData([counter]), true)
  assert.equal(isCounterData([{ ...counter, times: -1 }]), false)
  assert.equal(isCounterData([{ ...counter, title: 1 }]), false)
  assert.equal(isCounterData([{ ...counter, updatedAt: 'yesterday' }]), false)

  assert.equal(isVisitorData([visitor]), true)
  assert.equal(isVisitorData([{ ...visitor, totalVisitTimes: -1 }]), false)
  assert.equal(isVisitorData([{ ...visitor, visitors: {} }]), false)
  assert.equal(isVisitorData([{ ...visitor, visitors: [{ ...visitor.visitors[0], visitedTimes: 1.5 }] }]), false)
})

test('known newer statistics reject an older remote snapshot', () => {
  assert.doesNotThrow(() => assertCountersNotRegressed([counter], [{ ...counter, times: 3 }]))
  assert.throws(() => assertCountersNotRegressed([counter], [{ ...counter, times: 1 }]), /older/)
  assert.throws(() => assertCountersNotRegressed([counter], []), /older/)

  assert.doesNotThrow(() => assertVisitorsNotRegressed([visitor], [{ ...visitor, totalVisitTimes: 3 }]))
  assert.throws(
    () => assertVisitorsNotRegressed([visitor], [{ ...visitor, totalVisitTimes: 1 }]),
    /older/,
  )
})
