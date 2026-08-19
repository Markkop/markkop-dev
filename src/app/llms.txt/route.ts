import { AI_TEXT_HEADERS, buildLlmsTxt } from '@/lib/aiDiscovery'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsTxt(), { headers: AI_TEXT_HEADERS })
}
