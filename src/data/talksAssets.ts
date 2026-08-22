const TALKS_ORIGIN = 'https://talks.markkop.dev'

export function talksAsset(src: string) {
  if (/^https?:\/\//.test(src)) return src
  return `${TALKS_ORIGIN}${src.startsWith('/') ? src : `/${src}`}`
}
