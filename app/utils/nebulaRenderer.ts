import fragmentSource from '~/assets/shaders/nebula.frag.glsl?raw'
import vertexSource from '~/assets/shaders/nebula.vert.glsl?raw'

/** CSS pixels between particles */
const SPACING = 5
/** above this the spacing widens, so huge screens cost the same as large ones */
const MAX_PARTICLES = 100_000
const MAX_PIXEL_RATIO = 1.75
/**
 * Quality steps, heaviest first. Rendering starts on START_TIER, climbs while
 * frames keep landing on time and drops when they don't. Falling off the last
 * step means this machine shouldn't be running the scene at all.
 */
const TIERS = [
  { fps: 60, density: 1 },
  { fps: 30, density: 1 },
  { fps: 30, density: 0.55 },
  { fps: 20, density: 0.3 },
] as const
const START_TIER = 1
/** the 60fps step is pointless on a display that can't show it */
const MIN_REFRESH_FOR_TOP_TIER = 55
/** rAF gaps sampled to measure the display's refresh interval */
const REFRESH_SAMPLES = 60
/**
 * A machine too slow for the scene stretches every rAF gap, which would read
 * as a slow display and excuse the lateness, so nothing below 50Hz is believed
 */
const MAX_REFRESH_MS = 20
const JUDGE_WINDOW_MS = 2000
/** share of late frames in a window that steps quality down */
const LATE_SHARE_DOWN = 0.25
/** share of late frames in a window that still counts as clean */
const LATE_SHARE_CLEAN = 0.02
/** clean windows in a row before trying the next step up */
const CLEAN_WINDOWS_UP = 3
/** a gap this long is the tab or window being paused, not a slow frame */
const PAUSE_GAP_MS = 250
const INTRO_SECONDS = 2.4
const DISPERSE_SECONDS = 1.6
const POINTER_FOLLOW_SECONDS = 0.25
const POINTER_HOLD_SECONDS = 0.5
const DIM = 0.55

/**
 * A blocklisted or missing GPU still yields a WebGL2 context backed by a
 * software rasteriser, which would spend whole CPU cores on this.
 */
const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|softpipe|software|basic render/i

export type NebulaRenderer = {
  /** rejects when WebGL2 is unavailable or unusable; the caller drops the canvas */
  ready: Promise<void>
  dispose: () => void
  /** reduced motion paints one settled frame per resize instead of animating */
  setReduced: (reduced: boolean) => void
  /** blows the cloud apart; resolves once it is gone, or straight away under reduced motion */
  disperse: () => Promise<void>
}

export type NebulaOptions = {
  src: string
  reduced: boolean
  /** the lowest quality step still can't keep up */
  onStruggle: () => void
}

type Point = [number, number]

export function createNebulaRenderer (
  canvas: HTMLCanvasElement,
  { src, reduced: reducedAtStart, onStruggle }: NebulaOptions,
): NebulaRenderer {
  let disposed = false
  let reduced = reducedAtStart
  let gl: WebGL2RenderingContext | undefined
  let program: WebGLProgram | undefined
  let texture: WebGLTexture | null = null
  let imageSize: Point | undefined
  let observer: ResizeObserver | undefined
  let rafId = 0

  let width = 1
  let height = 1
  let pixelRatio = 1
  let grid: Point = [1, 1]
  let cover = [1, 1, 0, 0]
  let lod = 0

  let pointer: Point | undefined
  let smoothed: Point = [0.5, 0.5]
  let presence = 0
  let start = -1
  let lastTime = 0
  let lastRender = -Infinity
  let disperseStart: number | undefined
  let disperseDone: (() => void) | undefined

  let tier: number = START_TIER
  /** the heaviest step allowed; a step that once fell behind is not retried */
  let ceiling = 0
  let struggled = false
  let refreshMs = 1000 / 60
  const rafGaps: number[] = []
  let lastRaf = -1
  let lastDrawn = -1
  let windowStart = -1
  let windowFrames = 0
  let windowLate = 0
  let cleanWindows = 0

  let rejectReady: (error: Error) => void = () => {}
  let resolveReady: () => void = () => {}
  const ready = new Promise<void>((resolve, reject) => {
    resolveReady = resolve
    rejectReady = reject
  })

  type Uniforms = Record<'uImage' | 'uResolution' | 'uGrid' | 'uCover' | 'uLod' | 'uPointer' | 'uMisc' | 'uDim' | 'uDisperse', WebGLUniformLocation | null>
  let uniforms: Uniforms | undefined

  const schedule = () => {
    if (disposed) { return }
    lastRender = -Infinity
    rafId ||= requestAnimationFrame(frame)
  }

  const layout = () => {
    if (!imageSize) { return }
    const cssWidth = width / pixelRatio
    const cssHeight = height / pixelRatio
    const spacing = Math.max(SPACING, Math.sqrt(cssWidth * cssHeight / MAX_PARTICLES))
      / Math.sqrt(TIERS[tier]!.density)
    grid = [Math.ceil(cssWidth / spacing), Math.ceil(cssHeight / spacing)]

    const screenAspect = width / height
    const imageAspect = imageSize[0] / imageSize[1]
    const sx = screenAspect < imageAspect ? screenAspect / imageAspect : 1
    const sy = screenAspect < imageAspect ? 1 : imageAspect / screenAspect
    cover = [sx, sy, 0.5 - sx / 2, 0.5 - sy / 2]
    lod = Math.max(0, Math.log2(imageSize[1] * sy / grid[1]))
  }

  const measure = () => {
    if (!gl) { return }
    const rect = canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) { return }
    pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
    const nextWidth = Math.max(1, Math.floor(rect.width * pixelRatio))
    const nextHeight = Math.max(1, Math.floor(rect.height * pixelRatio))
    if (nextWidth !== width || nextHeight !== height) {
      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }
    layout()
    schedule()
  }

  /** interval the frame loop aims for, snapped to whole display refreshes */
  const targetGap = () => {
    const interval = 1000 / TIERS[tier]!.fps
    return Math.max(1, Math.ceil((interval - refreshMs / 2) / refreshMs)) * refreshMs
  }

  const resetWindow = (now: number) => {
    windowStart = now
    windowFrames = 0
    windowLate = 0
  }

  const setTier = (next: number, now: number) => {
    tier = next
    layout()
    resetWindow(now)
  }

  const measureRefresh = (gap: number) => {
    if (rafGaps.length >= REFRESH_SAMPLES || gap <= 0 || gap >= PAUSE_GAP_MS) { return }
    rafGaps.push(gap)
    if (rafGaps.length < REFRESH_SAMPLES) { return }
    // a low percentile, so frames a busy main thread delayed don't skew it
    rafGaps.sort((a, b) => a - b)
    refreshMs = Math.min(rafGaps[Math.floor(REFRESH_SAMPLES * 0.1)]!, MAX_REFRESH_MS)
    if (1000 / refreshMs < MIN_REFRESH_FOR_TOP_TIER) { ceiling = Math.max(ceiling, 1) }
  }

  /** judges each drawn frame against its target and moves between steps */
  const judge = (now: number, time: number) => {
    const gap = lastDrawn < 0 ? -1 : now - lastDrawn
    lastDrawn = now
    const settling = time < INTRO_SECONDS || rafGaps.length < REFRESH_SAMPLES
    if (struggled || disperseDone || settling || gap < 0 || gap >= PAUSE_GAP_MS || windowStart < 0) {
      resetWindow(now)
      return
    }
    windowFrames++
    if (gap > targetGap() + refreshMs / 2) { windowLate++ }
    if (now - windowStart < JUDGE_WINDOW_MS) { return }

    const lateShare = windowLate / windowFrames
    resetWindow(now)
    if (lateShare > LATE_SHARE_DOWN) {
      cleanWindows = 0
      ceiling = Math.max(ceiling, tier + 1)
      if (tier + 1 >= TIERS.length) {
        struggled = true
        onStruggle()
        return
      }
      setTier(tier + 1, now)
    } else if (lateShare <= LATE_SHARE_CLEAN) {
      if (++cleanWindows >= CLEAN_WINDOWS_UP && tier > ceiling) {
        cleanWindows = 0
        setTier(tier - 1, now)
      }
    } else {
      cleanWindows = 0
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') { return }
    pointer = [event.clientX / window.innerWidth, event.clientY / window.innerHeight]
  }
  const handlePointerLeave = () => {
    pointer = undefined
  }
  const handleContextLost = (event: Event) => {
    event.preventDefault()
    dispose()
    rejectReady(new Error('WebGL context lost.'))
  }

  const frame = (now: number) => {
    rafId = 0
    if (disposed || !gl || !uniforms || !imageSize) { return }
    if (!reduced) { rafId = requestAnimationFrame(frame) }
    measureRefresh(lastRaf < 0 ? 0 : now - lastRaf)
    lastRaf = now
    if (now - lastRender < 1000 / TIERS[tier]!.fps - refreshMs / 2) { return }
    lastRender = now

    if (start < 0) { start = now }
    const time = (now - start) / 1000
    const dt = Math.min(Math.max(time - lastTime, 0), 0.05)
    lastTime = time

    const follow = 1 - Math.exp(-dt / POINTER_FOLLOW_SECONDS)
    const target = pointer ?? smoothed
    smoothed = [
      smoothed[0] + (target[0] - smoothed[0]) * follow,
      smoothed[1] + (target[1] - smoothed[1]) * follow,
    ]
    presence += ((pointer ? 1 : 0) - presence) * (1 - Math.exp(-dt / POINTER_HOLD_SECONDS))
    if (disperseDone) { disperseStart ??= time }
    const dispersal = disperseStart === undefined ? 0 : Math.min((time - disperseStart) / DISPERSE_SECONDS, 1)

    gl.uniform2f(uniforms.uResolution, width, height)
    gl.uniform2f(uniforms.uGrid, grid[0], grid[1])
    gl.uniform4f(uniforms.uCover, cover[0]!, cover[1]!, cover[2]!, cover[3]!)
    gl.uniform1f(uniforms.uLod, lod)
    gl.uniform2f(uniforms.uPointer, smoothed[0], smoothed[1])
    gl.uniform4f(uniforms.uMisc, time, reduced ? 0 : presence, reduced ? 1 : Math.min(time / INTRO_SECONDS, 1), pixelRatio)
    gl.uniform1f(uniforms.uDim, DIM)
    gl.uniform1f(uniforms.uDisperse, dispersal)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, grid[0] * grid[1] * 6)
    if (!reduced) { judge(now, time) }

    if (dispersal >= 1) {
      disperseDone?.()
      disperseDone = undefined
    }
  }

  const setReduced = (next: boolean) => {
    reduced = next
    schedule()
  }

  const disperse = () => {
    if (reduced || disposed || !imageSize) { return Promise.resolve() }
    return new Promise<void>((resolve) => {
      disperseDone = resolve
      schedule()
    })
  }

  const dispose = () => {
    if (disposed) { return }
    disposed = true
    disperseDone?.()
    disperseDone = undefined
    if (rafId) { cancelAnimationFrame(rafId) }
    rafId = 0
    observer?.disconnect()
    window.removeEventListener('pointermove', handlePointerMove)
    document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    canvas.removeEventListener('webglcontextlost', handleContextLost)
    if (gl) {
      gl.deleteTexture(texture)
      gl.deleteProgram(program ?? null)
    }
    gl = undefined
    program = undefined
  }

  const compile = (context: WebGL2RenderingContext, type: number, source: string) => {
    const shader = context.createShader(type)
    if (!shader) { throw new Error('Could not create shader.') }
    context.shaderSource(shader, source)
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      const log = context.getShaderInfoLog(shader)
      context.deleteShader(shader)
      throw new Error(`Shader failed to compile: ${log}`)
    }
    return shader
  }

  const initialise = () => {
    const context = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!context) { throw new Error('No WebGL2 context.') }

    const debugInfo = context.getExtension('WEBGL_debug_renderer_info')
    const name = String(
      (debugInfo && context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      || context.getParameter(context.RENDERER)
      || '',
    )
    if (SOFTWARE_RENDERERS.test(name)) {
      throw new Error(`Software renderer (${name}).`)
    }
    gl = context

    const vertex = compile(context, context.VERTEX_SHADER, vertexSource)
    const fragment = compile(context, context.FRAGMENT_SHADER, fragmentSource)
    const linked = context.createProgram()
    context.attachShader(linked, vertex)
    context.attachShader(linked, fragment)
    context.linkProgram(linked)
    context.deleteShader(vertex)
    context.deleteShader(fragment)
    if (!context.getProgramParameter(linked, context.LINK_STATUS)) {
      const log = context.getProgramInfoLog(linked)
      context.deleteProgram(linked)
      throw new Error(`Program failed to link: ${log}`)
    }
    program = linked
    context.useProgram(linked)

    const at = (uniform: string) => context.getUniformLocation(linked, uniform)
    uniforms = {
      uImage: at('uImage'),
      uResolution: at('uResolution'),
      uGrid: at('uGrid'),
      uCover: at('uCover'),
      uLod: at('uLod'),
      uPointer: at('uPointer'),
      uMisc: at('uMisc'),
      uDim: at('uDim'),
      uDisperse: at('uDisperse'),
    }
    context.uniform1i(uniforms.uImage, 0)

    // every vertex comes from gl_VertexID, so only an empty vertex array is bound
    context.bindVertexArray(context.createVertexArray())
    context.enable(context.BLEND)
    context.blendFunc(context.ONE, context.ONE)
    context.clearColor(0, 0, 0, 1)

    measure()
    observer = new ResizeObserver(measure)
    observer.observe(canvas)
    window.addEventListener('pointermove', handlePointerMove)
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    canvas.addEventListener('webglcontextlost', handleContextLost)

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (disposed || !gl) { return }
      texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      imageSize = [image.naturalWidth, image.naturalHeight]
      layout()
      schedule()
      resolveReady()
    }
    image.onerror = () => {
      dispose()
      rejectReady(new Error(`Could not load ${src}.`))
    }
    image.src = src
  }

  try {
    initialise()
  } catch (error) {
    dispose()
    rejectReady(error instanceof Error ? error : new Error(String(error)))
  }

  return { ready, dispose, setReduced, disperse }
}
