import { AI_TEXT_HEADERS, buildAiTxt } from '@/lib/aiDiscovery'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildAiTxt(), { headers: AI_TEXT_HEADERS })
}
