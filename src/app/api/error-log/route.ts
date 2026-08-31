import { NextResponse } from 'next/server'
import { logAppError } from '@/lib/appError'

export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 16_384

function asTrimmedString(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, max)
}

export async function POST(request: Request) {
  try {
    const raw = await request.text()
    if (!raw || raw.length > MAX_BODY_BYTES) {
      return new NextResponse(null, { status: 204 })
    }

    const body: unknown = JSON.parse(raw)
    if (!body || typeof body !== 'object') {
      return new NextResponse(null, { status: 204 })
    }

    const payload = body as Record<string, unknown>
    logAppError(
      {
        name: asTrimmedString(payload.name, 120) || 'Error',
        message: asTrimmedString(payload.message, 500) || '',
        digest: asTrimmedString(payload.digest, 64),
        stack: asTrimmedString(payload.stack, 4000),
      },
      'client-report',
    )
  } catch {
    /* malformed payloads are ignored */
  }

  return new NextResponse(null, { status: 204 })
}
