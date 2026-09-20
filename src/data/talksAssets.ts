export function talksAsset(src: string) {
  if (/^https?:\/\//.test(src)) return src
  return src.startsWith('/') ? src : `/${src}`
}
