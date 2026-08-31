'use client'

import ErrorScreen from '@/components/ErrorScreen'
import type { AppRouteError } from '@/lib/appError'

export default function ErrorPage({
  error,
  reset,
}: {
  error: AppRouteError
  reset: () => void
}) {
  return <ErrorScreen error={error} reset={reset} />
}
