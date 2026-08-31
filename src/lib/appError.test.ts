import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatAppErrorLog,
  formatErrorDump,
  getErrorEyebrow,
  serializeAppError,
} from './appError.ts'

test('never defaults the eyebrow to 500', () => {
  assert.equal(getErrorEyebrow(new Error('boom')), '// ERROR')
})

test('uses a real HTTP status only when present', () => {
  const error = Object.assign(new Error('nope'), { status: 503 })
  assert.equal(getErrorEyebrow(error), '// 503')
})

test('humanizes error names like ChunkLoadError', () => {
  const error = Object.assign(new Error('Loading chunk 7 failed'), { name: 'ChunkLoadError' })
  assert.equal(getErrorEyebrow(error), '// CHUNK LOAD ERROR')
})

test('labels missing server actions from the message', () => {
  assert.equal(
    getErrorEyebrow(new Error('Failed to find Server Action `save`.')),
    '// SERVER ACTION',
  )
})

test('falls back to a short digest label', () => {
  const error = Object.assign(new Error('An error occurred in the Server Components render.'), {
    digest: 'abc123def456',
  })
  assert.equal(getErrorEyebrow(error), '// ERR ABC123DE')
})

test('dump includes name, message, and digest', () => {
  const error = Object.assign(new Error('Loading chunk 7 failed'), {
    name: 'ChunkLoadError',
    digest: 'deadbeef',
  })
  assert.equal(
    formatErrorDump(error),
    'ChunkLoadError: Loading chunk 7 failed\ndigest: deadbeef',
  )
})

test('redacts secrets from structured logs', () => {
  const payload = serializeAppError(
    {
      name: 'Error',
      message: 'Authorization: Bearer super-secret-token',
      stack: 'cookie: session=abc\npassword=hunter2',
      digest: 'ok',
    },
    'error-boundary',
  )
  const line = formatAppErrorLog(payload)
  assert.match(line, /^\[app-error\] /)
  assert.doesNotMatch(line, /super-secret-token/)
  assert.doesNotMatch(line, /hunter2/)
  assert.doesNotMatch(line, /session=abc/)
  assert.match(line, /\[redacted\]/)
  assert.match(line, /"digest":"ok"/)
})
