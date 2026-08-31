export type AppRouteError = Error & {
  digest?: string
  status?: number
  statusCode?: number
}

export type AppErrorLogSource = 'error-boundary' | 'onRequestError' | 'client-report'

export type AppErrorLogPayload = {
  source: AppErrorLogSource
  name: string
  message: string
  digest?: string
  stack?: string
  path?: string
  method?: string
  routeType?: string
}

const GENERIC_ERROR_NAMES = new Set(['Error', 'Exception', 'DOMException'])

const SECRET_PATTERN =
  /(?:(?:authorization|cookie)\s*[:=]\s*[^\n]+|(?:bearer|token)\s+[^\s]+|(?:api[_-]?key|password|secret)\s*[:=]\s*[^\s"'\\]+|eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/gi

const MAX_MESSAGE = 500
const MAX_STACK = 4000
const MAX_NAME = 120
const MAX_DIGEST = 64
const MAX_PATH = 300

function redact(value: string, max: number): string {
  return value.replace(SECRET_PATTERN, '[redacted]').slice(0, max)
}

function readStatus(error: AppRouteError): number | undefined {
  for (const value of [error.statusCode, error.status]) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 400 && value <= 599) {
      return value
    }
  }
  return undefined
}

function humanizeErrorName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

function messageLabel(message: string): string | undefined {
  if (/server action/i.test(message)) return 'SERVER ACTION'
  if (/loading chunk|chunkload/i.test(message)) return 'CHUNK LOAD ERROR'
  return undefined
}

export function getErrorEyebrow(error: AppRouteError): string {
  const status = readStatus(error)
  if (status !== undefined) return `// ${status}`

  const name = (error.name || '').trim()
  if (name && !GENERIC_ERROR_NAMES.has(name)) {
    return `// ${humanizeErrorName(name)}`
  }

  const fromMessage = messageLabel(error.message || '')
  if (fromMessage) return `// ${fromMessage}`

  if (error.digest) {
    return `// ERR ${error.digest.slice(0, 8).toUpperCase()}`
  }

  return '// ERROR'
}

export function formatErrorDump(error: AppRouteError): string {
  const name = (error.name || 'Error').trim() || 'Error'
  const message = (error.message || '').trim()
  const headline = !message
    ? `${name}: (no message)`
    : message.startsWith(name)
      ? message
      : `${name}: ${message}`

  const lines = [headline]
  if (error.digest) lines.push(`digest: ${error.digest}`)
  return lines.join('\n')
}

export function formatErrorStack(error: AppRouteError): string | undefined {
  if (!error.stack) return undefined
  const lines = error.stack.split('\n').slice(0, 40)
  const trimmed = lines.join('\n').trim()
  return trimmed || undefined
}

export function serializeAppError(
  error: Partial<AppRouteError> | AppErrorLogPayload,
  source: AppErrorLogSource,
): AppErrorLogPayload {
  const name = redact(String(error.name || 'Error'), MAX_NAME) || 'Error'
  const message = redact(String(error.message || ''), MAX_MESSAGE)
  const digest = error.digest ? redact(String(error.digest), MAX_DIGEST) : undefined
  const stack = error.stack ? redact(String(error.stack), MAX_STACK) : undefined
  const path = 'path' in error && error.path ? redact(String(error.path), MAX_PATH) : undefined
  const method = 'method' in error && error.method ? redact(String(error.method), 16) : undefined
  const routeType = 'routeType' in error && error.routeType ? redact(String(error.routeType), 64) : undefined

  return {
    source,
    name,
    message,
    ...(digest ? { digest } : {}),
    ...(stack ? { stack } : {}),
    ...(path ? { path } : {}),
    ...(method ? { method } : {}),
    ...(routeType ? { routeType } : {}),
  }
}

export function formatAppErrorLog(payload: AppErrorLogPayload): string {
  return `[app-error] ${JSON.stringify(payload)}`
}

export function logAppError(
  error: Partial<AppRouteError> | AppErrorLogPayload,
  source: AppErrorLogSource,
): void {
  try {
    console.error(formatAppErrorLog(serializeAppError(error, source)))
  } catch {
    try {
      console.error('[app-error] failed to serialize error')
    } catch {
      /* logging must never throw */
    }
  }
}

export function reportAppError(error: AppRouteError): void {
  logAppError(error, 'error-boundary')
  if (typeof window === 'undefined') return

  try {
    const body = JSON.stringify(serializeAppError(error, 'client-report'))
    void fetch('/api/error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* reporting must never break retry */
    })
  } catch {
    /* reporting must never throw */
  }
}
