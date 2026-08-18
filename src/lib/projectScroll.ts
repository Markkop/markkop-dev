const MOBILE_PROJECT_MEDIA = '(max-width: 1024px)'

function isMobileProjectTrack() {
  return window.matchMedia(MOBILE_PROJECT_MEDIA).matches
}

function scrollDistance(track: HTMLElement) {
  return Math.max(track.offsetHeight - window.innerHeight, 1)
}

export function projectScrollTop(track: HTMLElement, index: number, projectCount: number) {
  const distance = scrollDistance(track)
  const steps = isMobileProjectTrack() ? projectCount : Math.max(projectCount - 1, 1)
  return track.offsetTop + (index / steps) * distance
}

export function projectIndexAt(track: HTMLElement, scrollY: number, projectCount: number) {
  const progress = (scrollY - track.offsetTop) / scrollDistance(track)
  return Math.max(0, Math.min(Math.floor(progress * projectCount), projectCount - 1))
}
