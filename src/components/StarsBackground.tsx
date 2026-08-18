'use client'

import { useEffect, useRef } from 'react'
import { type StarPalette } from '@/data/starPalettes'

type Three = typeof import('three')

function pickColor(THREE: Three, palette: StarPalette, random: number) {
  if (random < 0.5) return new THREE.Color(palette.primary)
  if (random < 0.85) return new THREE.Color(palette.secondary)
  return new THREE.Color(palette.ice)
}

function radialSprite(THREE: Three, palette: StarPalette) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Texture()
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.25, palette.glow)
  gradient.addColorStop(1, `${palette.primary}00`)
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function StarsBackground({ palette }: { palette: StarPalette }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paletteRef = useRef(palette)
  const applyPaletteRef = useRef<(next: StarPalette) => void>(() => {})
  paletteRef.current = palette

  useEffect(() => {
    applyPaletteRef.current(palette)
  }, [palette])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let stopped = false
    let cleanup = () => {
      stopped = true
    }

    void import('three').then((THREE) => {
      if (stopped) return

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const reduceMotion = reducedMotionQuery.matches
      const smallScreen = window.innerWidth <= 720
      const hardwareThreads = navigator.hardwareConcurrency || 4
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      const constrainedDevice = hardwareThreads <= 4 || (deviceMemory !== undefined && deviceMemory <= 4)
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        reduceMotion || smallScreen || constrainedDevice ? 1 : 1.25,
      )
      const targetParticlesPerViewport = reduceMotion ? 200 : smallScreen ? 400 : constrainedDevice ? 600 : 800
      const targetFrameRate = constrainedDevice ? 30 : 60
      const disposables: Array<{ dispose: () => void }> = []
      const timers: number[] = []
      let frame = 0
      let resizeTimer = 0

      let sprite: InstanceType<Three['Texture']> | undefined
      try {
        sprite = radialSprite(THREE, paletteRef.current)

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: true,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance',
        })
        renderer.setPixelRatio(pixelRatio)
        renderer.setClearColor(new THREE.Color(paletteRef.current.fog), 0)
        disposables.push(renderer)

        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(paletteRef.current.fog, 0.00085)
        const camera = new THREE.PerspectiveCamera(60, 1, 1, 3000)
        camera.position.set(0, 0, 620)

        const backgroundDistance = 620
        const backgroundFov = 60
        const backgroundParallax = 0.12
        const width = () => host.clientWidth || window.innerWidth
        const height = () => host.clientHeight || window.innerHeight
        const documentHeight = () => Math.max(document.documentElement.scrollHeight, window.innerHeight)
        const worldHeight = () => 2 * backgroundDistance * Math.tan(((backgroundFov * Math.PI) / 180) / 2)
        const unitsPerPixel = () => worldHeight() / height()
        let fieldUnitsPerPixel = unitsPerPixel()

        const maxParticles = reduceMotion ? 500 : smallScreen ? 900 : constrainedDevice ? 1200 : 1800
        const particleGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(maxParticles * 3)
        const colors = new Float32Array(maxParticles * 3)
        const sizes = new Float32Array(maxParticles)
        const rolls = new Float32Array(maxParticles)
        for (let index = 0; index < maxParticles; index += 1) {
          rolls[index] = Math.random()
          const color = pickColor(THREE, paletteRef.current, rolls[index])
          colors[index * 3] = color.r
          colors[index * 3 + 1] = color.g
          colors[index * 3 + 2] = color.b
          sizes[index] = Math.random() * 3 + 2.3
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
        disposables.push(particleGeometry)

        let builtSpan = -1
        function rebuildField() {
          fieldUnitsPerPixel = unitsPerPixel()
          const halfView = worldHeight() / 2
          const scrollWorld =
            (Math.max(documentHeight(), height()) - height()) * fieldUnitsPerPixel * backgroundParallax
          const top = halfView + 220
          const bottom = -scrollWorld - halfView - 220
          const span = top - bottom
          if (builtSpan > 0 && Math.abs(span - builtSpan) < worldHeight() * 0.5) return
          builtSpan = span
          const count = Math.max(
            targetParticlesPerViewport,
            Math.min(maxParticles, Math.round(targetParticlesPerViewport * (span / worldHeight()))),
          )
          for (let index = 0; index < count; index += 1) {
            positions[index * 3] = (Math.random() - 0.5) * 3000
            positions[index * 3 + 1] = bottom + Math.random() * span
            positions[index * 3 + 2] = 0
          }
          const attribute = particleGeometry.getAttribute('position') as InstanceType<Three['BufferAttribute']>
          attribute.needsUpdate = true
          particleGeometry.setDrawRange(0, count)
        }

        const particleMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uTex: { value: sprite },
            uPix: { value: pixelRatio },
          },
          vertexShader: `
            attribute float aSize;
            varying vec3 vColor;
            uniform float uTime, uPix;
            void main() {
              vColor = color;
              vec3 p = position;
              p.x += sin(uTime * 0.28 + position.y * 0.012) * 9.0;
              p.y += cos(uTime * 0.22 + position.x * 0.012) * 8.0;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              float twinkle = 0.75 + 0.25 * sin(uTime * 1.4 + position.x * 0.7 + position.y * 0.3);
              gl_PointSize = aSize * uPix * (640.0 / -mv.z) * twinkle;
              gl_Position = projectionMatrix * mv;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            uniform sampler2D uTex;
            void main() {
              vec4 textureColor = texture2D(uTex, gl_PointCoord);
              if (textureColor.a < 0.02) discard;
              vec3 luminousColor = mix(vColor, vec3(1.0), 0.22);
              gl_FragColor = vec4(luminousColor, textureColor.a * 0.94);
            }
          `,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
        })
        disposables.push(particleMaterial)
        scene.add(new THREE.Points(particleGeometry, particleMaterial))

        function renderStatic() {
          particleMaterial.uniforms.uTime.value = 0
          camera.position.y = 0
          renderer.render(scene, camera)
        }

        function applyPalette(next: StarPalette) {
          if (stopped) return
          for (let index = 0; index < maxParticles; index += 1) {
            const color = pickColor(THREE, next, rolls[index])
            colors[index * 3] = color.r
            colors[index * 3 + 1] = color.g
            colors[index * 3 + 2] = color.b
          }
          const attribute = particleGeometry.getAttribute('color') as InstanceType<Three['BufferAttribute']>
          attribute.needsUpdate = true
          scene.fog = new THREE.FogExp2(next.fog, 0.00085)
          renderer.setClearColor(new THREE.Color(next.fog), 0)
          const nextSprite = radialSprite(THREE, next)
          particleMaterial.uniforms.uTex.value = nextSprite
          sprite?.dispose()
          sprite = nextSprite
          if (reduceMotion) renderStatic()
        }

        applyPaletteRef.current = applyPalette

        function resize() {
          if (stopped) return
          const viewportWidth = width()
          const viewportHeight = height()
          if (viewportWidth <= 0 || viewportHeight <= 0) return
          renderer.setPixelRatio(pixelRatio)
          renderer.setSize(viewportWidth, viewportHeight, false)
          camera.aspect = viewportWidth / viewportHeight
          camera.updateProjectionMatrix()
          rebuildField()
          if (reduceMotion) renderStatic()
        }

        function scheduleResize() {
          window.clearTimeout(resizeTimer)
          resizeTimer = window.setTimeout(resize, 120)
        }

        const observer = new ResizeObserver(scheduleResize)
        observer.observe(host)
        window.addEventListener('resize', scheduleResize, { passive: true })
        window.addEventListener('load', resize)
        timers.push(window.setTimeout(resize, 400), window.setTimeout(resize, 1500))

        const clock = new THREE.Clock()
        const frameInterval = 1000 / targetFrameRate
        let lastFrameTime = 0

        function animate(timestamp: number) {
          if (stopped || document.hidden) {
            frame = 0
            return
          }
          frame = window.requestAnimationFrame(animate)
          const time = clock.getElapsedTime()
          if (timestamp - lastFrameTime < frameInterval) return
          lastFrameTime = timestamp - ((timestamp - lastFrameTime) % frameInterval)
          particleMaterial.uniforms.uTime.value = time
          camera.position.y = -window.scrollY * fieldUnitsPerPixel * backgroundParallax
          renderer.render(scene, camera)
        }

        function handleVisibilityChange() {
          if (reduceMotion || stopped) return
          if (document.hidden) {
            window.cancelAnimationFrame(frame)
            frame = 0
          } else if (frame === 0) {
            lastFrameTime = performance.now()
            frame = window.requestAnimationFrame(animate)
          }
        }

        resize()
        document.addEventListener('visibilitychange', handleVisibilityChange)
        if (!reduceMotion) frame = window.requestAnimationFrame(animate)

        cleanup = () => {
          stopped = true
          applyPaletteRef.current = () => {}
          window.cancelAnimationFrame(frame)
          window.clearTimeout(resizeTimer)
          for (const timer of timers) window.clearTimeout(timer)
          observer.disconnect()
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          window.removeEventListener('resize', scheduleResize)
          window.removeEventListener('load', resize)
          for (const disposable of disposables) disposable.dispose()
          sprite?.dispose()
        }
      } catch (error) {
        console.warn('[projects] WebGL starfield unavailable', error)
        canvas.style.display = 'none'
        sprite?.dispose()
        for (const disposable of disposables) disposable.dispose()
      }
    })

    return () => cleanup()
  }, [])

  return (
    <div
      ref={hostRef}
      className="mk-project-background"
      style={{ backgroundColor: palette.fog }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
      <i />
    </div>
  )
}
