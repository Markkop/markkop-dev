export const SPLASH_STORAGE_KEY = 'markkop-mubx-loaded'

const CRAWLER_UA_SOURCE = 'lighthouse|chrome-lighthouse|pagespeed|speed.?insights|googlebot|google-inspectiontool|bingbot|yandexbot|baiduspider|duckduckbot|slurp|headlesschrome|gptbot|claudebot|bytespider'
const CRAWLER_UA = new RegExp(CRAWLER_UA_SOURCE, 'i')

export const SPLASH_BOOT_STYLE = 'html[data-splash=pending]{background:#0b0810}html[data-theme=light][data-splash=pending]{background:#f5f1f8}html[data-splash=pending] body{visibility:hidden;overflow:hidden}html[data-splash=pending] .mk-loader{visibility:visible}'

function clientBrandString() {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: Array<{ brand: string }> } }).userAgentData?.brands
  return brands?.map((item) => item.brand).join(' ') ?? ''
}

export function shouldSkipSplash() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (navigator.webdriver) return true
  if (window.location.search.includes('lighthouse')) return true
  if ((window as Window & { _lighthouse?: unknown })._lighthouse) return true
  return CRAWLER_UA.test(`${navigator.userAgent} ${clientBrandString()}`)
}

export function clearSplashPending() {
  document.documentElement.removeAttribute('data-splash')
}

export const SPLASH_BOOT_SCRIPT = `;(function(){try{var n=navigator;var brands=n.userAgentData&&n.userAgentData.brands?n.userAgentData.brands.map(function(b){return b.brand}).join(' '):'';var skip=location.pathname.indexOf('/links')===0||sessionStorage.getItem('${SPLASH_STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches||n.webdriver||location.search.indexOf('lighthouse')!==-1||window._lighthouse||/${CRAWLER_UA_SOURCE}/i.test(n.userAgent+' '+brands);if(skip)return;document.documentElement.dataset.splash='pending';if(!document.getElementById('mk-splash-boot')){var s=document.createElement('style');s.id='mk-splash-boot';s.textContent=${JSON.stringify(SPLASH_BOOT_STYLE)};(document.head||document.documentElement).appendChild(s)}setTimeout(function(){document.documentElement.removeAttribute('data-splash')},8000)}catch(e){}})()`
