import { logAppError } from '@/lib/appError'

type RequestInfo = {
  path: string
  method: string
}

type ErrorContext = {
  routeType?: string
}

export async function onRequestError(
  error: unknown,
  request: RequestInfo,
  context: ErrorContext,
): Promise<void> {
  const err = error instanceof Error ? error : new Error(String(error))
  const digest =
    typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string'
      ? error.digest
      : undefined

  logAppError(
    {
      name: err.name,
      message: err.message,
      stack: err.stack,
      digest,
      path: request.path,
      method: request.method,
      routeType: context.routeType,
    },
    'onRequestError',
  )
}
