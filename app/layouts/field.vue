<script setup lang="ts">
import { useEventListener, useDebounceFn } from '@vueuse/core'

const route = useRoute()
const { reduced } = useMotionPreference()
useDisplayPreferences()
// Opens the presence socket once; the pages read the shared state.
useLanyard()

// Each page's hue colours its particle title, the nav marker and its links.
const views = [
  { id: 'about', label: 'About', to: '/about', tone: '#d9c6ff' },
  { id: 'work', label: 'Work', to: '/work', tone: '#5fb2ff' },
  { id: 'writing', label: 'Writing', to: '/writing', tone: '#ff7ac8' },
  { id: 'live', label: 'Live', to: '/live', tone: '#46e08c' },
] as const
const HOME_TONE = '#c2a5ff'
const view = computed(() => route.path.split('/')[1] || 'home')
const tone = computed(() => views.find(v => v.id === view.value)?.tone ?? HOME_TONE)
// A page can borrow the particle title, as Work does for the project under the pointer.
const focus = useState<string | undefined>('field-focus', () => undefined)
const title = computed(() => views.find(v => v.id === view.value)?.label)
useHead({ title: computed(() => title.value ? `${title.value}, Jordan Jones` : 'Jordan Jones') })

// --- The images the particle field takes its colour from -------------------

const DISPLAY_FONT = '"PP Neue Machina Inktrap"'
const loadImage = (src: string) => new Promise<HTMLImageElement | undefined>((resolve) => {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => resolve(image)
  image.onerror = () => resolve(undefined)
  image.src = src
})
let nebula: HTMLImageElement | undefined
let banner: HTMLImageElement | undefined
const assets = import.meta.client
  ? Promise.all([
      loadImage('/nebula.jpg').then((image) => { nebula = image }),
      loadImage(bannerUrl(DISCORD_USER_ID, 1024)).then((image) => { banner = image }),
      document.fonts.load(`400 100px ${DISPLAY_FONT}`),
    ])
  : Promise.resolve()

// --- The eyes --------------------------------------------------------------

// The banner's eyes, in its own pixels at 1024 wide, outer corner to inner:
// T is the top of the upper lash band, U its lower edge (the top of the open
// eye) and L the lower lash line. `white` is the x span of the visible eye and
// `iris` its centre and radii.
type Curve = [number, number][]
type Pair = [number, number]
const BANNER_WIDTH = 1024
const EYES: { T: Curve, U: Curve, L: Curve, white: Pair, iris: [number, number, number, number] }[] = [
  {
    T: [[118, 238], [200, 210], [260, 184], [300, 178], [340, 180], [384, 200], [424, 260]],
    U: [[118, 240], [200, 268], [240, 234], [272, 218], [304, 213], [344, 217], [376, 233], [400, 256], [424, 290]],
    L: [[118, 240], [204, 300], [260, 310], [320, 299], [368, 294], [424, 291]],
    white: [200, 418],
    iris: [322, 262, 70, 62],
  },
  {
    T: [[598, 240], [640, 200], [680, 178], [720, 176], [760, 184], [800, 208], [840, 226], [908, 238]],
    U: [[598, 285], [612, 256], [640, 226], [680, 212], [720, 210], [760, 218], [800, 236], [822, 264], [908, 240]],
    L: [[598, 290], [604, 292], [692, 294], [740, 302], [792, 300], [822, 294], [908, 240]],
    white: [602, 822],
    iris: [700, 262, 69, 62],
  },
]
// The midpoint between the pupils, which the gaze is measured from.
const EYES_CENTRE: Pair = [511, 262]
// How far the irises travel at full gaze, in banner pixels.
const GAZE_REACH: Pair = [22, 6]

const yAt = (curve: Curve, x: number) => {
  if (x <= curve[0]![0]) return curve[0]![1]
  for (let i = 1; i < curve.length; i++) {
    const [x1, y1] = curve[i]!
    const [x0, y0] = curve[i - 1]!
    if (x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
  }
  return curve.at(-1)![1]
}

// An eye's visible opening, below its upper lid closed by `lid` (0 open, 1 shut).
const opening = (eye: typeof EYES[number], lid = 0) => {
  const path = new Path2D()
  for (let x = eye.white[0]; x <= eye.white[1]; x += 2) {
    const edge = yAt(eye.U, x)
    path.lineTo(x, edge + Math.max(0, (yAt(eye.L, x) - 3 - edge) * lid))
  }
  for (let x = eye.white[1]; x >= eye.white[0]; x -= 2) path.lineTo(x, yAt(eye.L, x) - 2)
  path.closePath()
  return path
}

// Keeps the most recently used entries; paintings are a few MB each.
function remember<T>(cache: Map<string, T>, key: string, limit: number, make: () => T) {
  const hit = cache.get(key)
  if (hit) {
    cache.delete(key)
    cache.set(key, hit)
    return hit
  }
  const made = make()
  cache.set(key, made)
  if (cache.size > limit) cache.delete(cache.keys().next().value!)
  return made
}

const bannerHeight = () => Math.round(BANNER_WIDTH * banner!.naturalHeight / banner!.naturalWidth)
const bannerCanvas = () => {
  const made = document.createElement('canvas')
  made.width = BANNER_WIDTH
  made.height = bannerHeight()
  return made
}

let bannerPixels: ImageData | undefined
const pixel = (x: number, y: number) => {
  const i = (Math.round(y) * bannerPixels!.width + Math.round(x)) * 4
  return [bannerPixels!.data[i]!, bannerPixels!.data[i + 1]!, bannerPixels!.data[i + 2]!]
}

// Both irises cut out of the banner onto a clear layer, for the renderer to
// slide towards the pointer. The cut follows the lower lash but not the upper
// lid, so the iris's shadowed top travels with it instead of leaving a gap.
let irisLayer: HTMLCanvasElement | undefined
function irises() {
  if (irisLayer || !banner) return irisLayer
  irisLayer = bannerCanvas()
  const ctx = irisLayer.getContext('2d')!
  for (const eye of EYES) {
    const [cx, cy, rx, ry] = eye.iris
    const aboveLash = new Path2D()
    aboveLash.moveTo(cx - rx, 0)
    aboveLash.lineTo(cx + rx, 0)
    for (let x = cx + rx; x >= cx - rx; x -= 2) aboveLash.lineTo(x, yAt(eye.L, x) - 2)
    aboveLash.closePath()
    ctx.save()
    ctx.clip(aboveLash)
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(banner, 0, 0, irisLayer.width, irisLayer.height)
    ctx.restore()
  }
  return irisLayer
}

const bannerFrames = new Map<string, HTMLCanvasElement>()

// The banner with the irises taken out, leaving the eye whites for them to
// move over, and the eyes closed by `lids` (0 open, 1 shut, per eye). Closing
// slides each column of the upper lash band down towards the lower lash and
// fills the gap with the skin just above the lashes, so it keeps the art's
// own linework and shading.
function bannerFrame(lids: Pair): HTMLCanvasElement | undefined {
  if (!banner) return undefined
  return remember(bannerFrames, `frame:${lids}`, 12, () => {
    const frame = bannerCanvas()
    const ctx = frame.getContext('2d')!
    ctx.drawImage(banner!, 0, 0, frame.width, frame.height)
    bannerPixels ??= ctx.getImageData(0, 0, frame.width, frame.height)

    if (!lids[0] && !lids[1]) {
      EYES.forEach((eye, i) => {
        const [cx, , rx] = eye.iris
        const white = pixel(cx + (i ? rx + 40 : -rx - 30), yAt(eye.L, cx) - 18)
        const top = Math.min(...eye.U.map(([, y]) => y))
        const fill = ctx.createLinearGradient(0, top, 0, top + 70)
        fill.addColorStop(0, `rgb(${white.map(c => c * 0.72).join(' ')})`)
        fill.addColorStop(0.45, `rgb(${white.join(' ')})`)
        ctx.fillStyle = fill
        ctx.fill(opening(eye))
      })
      return frame
    }

    const open = bannerFrame([0, 0])!
    ctx.drawImage(open, 0, 0)
    EYES.forEach((eye, i) => {
      if (!lids[i]) return
      for (let x = eye.T[0]![0]; x <= eye.T.at(-1)![0]; x++) {
        const top = yAt(eye.T, x)
        const edge = yAt(eye.U, x)
        const drop = Math.max(0, (yAt(eye.L, x) - 3 - edge) * lids[i]!)
        if (drop < 0.5) continue
        // the lightest of a few samples, so stray lashes and hair don't tint the lid
        const skin = [10, 16, 22].map(dy => pixel(x, top - dy)).reduce((a, b) => a[0]! + a[1]! + a[2]! >= b[0]! + b[1]! + b[2]! ? a : b)
        ctx.fillStyle = `rgb(${skin.join(' ')})`
        ctx.fillRect(x, top - 1, 1.5, drop + 1)
        ctx.drawImage(open, x, top, 1, edge - top, x, top + drop, 1.5, edge - top)
      }
    })
    return frame
  })
}

// Where the irises show: each eye's opening below its lid, white on clear.
function bannerMask(lids: Pair) {
  return remember(bannerFrames, `mask:${lids}`, 12, () => {
    const mask = bannerCanvas()
    const ctx = mask.getContext('2d')!
    ctx.fillStyle = '#fff'
    EYES.forEach((eye, i) => { if (lids[i]! < 1) ctx.fill(opening(eye, lids[i])) })
    return mask
  })
}

// --- Painting a view -------------------------------------------------------

// Wide enough for the particle spacing; the renderer samples a mip level of it.
const PAINT_WIDTH = 960
const paintHeight = () => Math.round(PAINT_WIDTH * window.innerHeight / window.innerWidth)

// Where a view puts the eyes: big on the home page, faint above the title elsewhere.
function placement(id: string, width: number, height: number) {
  const portrait = height > width
  if (id === 'home') {
    const eyesWidth = portrait ? width * 1.45 : width
    return { x: (width - eyesWidth) / 2, line: height * (portrait ? 0.3 : 0.36), width: eyesWidth, alpha: 1 }
  }
  return portrait
    ? { x: -width * 0.05, line: height * 0.2, width: width * 1.1, alpha: 0.3 }
    : { x: width * 0.37, line: height * 0.2, width: width * 0.6, alpha: 0.35 }
}

// Banner pixels map onto a view by its placement; 0.62 of the way down the
// banner is the line through the pupils.
function bannerOnView(id: string) {
  const height = paintHeight()
  const place = placement(id, PAINT_WIDTH, height)
  const scale = place.width / BANNER_WIDTH
  return { place, height, scale, top: place.line - bannerHeight() * scale * 0.62 }
}

// The gaze rests on the midpoint between the pupils, in screen uv; the
// painting has the screen's aspect, so it maps straight on.
function gazeFor(id: string): { anchor: Pair, reach: Pair } {
  const { place, height, scale, top } = bannerOnView(id)
  return {
    anchor: [(place.x + EYES_CENTRE[0] * scale) / PAINT_WIDTH, (top + EYES_CENTRE[1] * scale) / height],
    reach: [GAZE_REACH[0] * scale / PAINT_WIDTH, GAZE_REACH[1] * scale / height],
  }
}

function screenToBanner([sx, sy]: Pair): Pair {
  const { place, height, scale, top } = bannerOnView(view.value)
  return [(sx / window.innerWidth * PAINT_WIDTH - place.x) / scale, (sy / window.innerHeight * height - top) / scale]
}

// Draws a banner-sized layer where the view puts the eyes; feathered, the
// hair dissolves into the nebula.
function drawOnView(ctx: CanvasRenderingContext2D, id: string, source: HTMLCanvasElement, { feather = false, alpha = 1 } = {}) {
  const { place, scale, top } = bannerOnView(id)
  const layer = document.createElement('canvas')
  layer.width = Math.round(place.width)
  layer.height = Math.round(source.height * scale)
  const l = layer.getContext('2d')!
  l.drawImage(source, 0, 0, layer.width, layer.height)
  if (feather) {
    l.globalCompositeOperation = 'destination-in'
    const fadeY = l.createLinearGradient(0, 0, 0, layer.height)
    fadeY.addColorStop(0, 'rgba(0,0,0,0)')
    fadeY.addColorStop(0.2, 'rgba(0,0,0,1)')
    fadeY.addColorStop(0.72, 'rgba(0,0,0,1)')
    fadeY.addColorStop(1, 'rgba(0,0,0,0)')
    l.fillStyle = fadeY
    l.fillRect(0, 0, layer.width, layer.height)
    const fadeX = l.createLinearGradient(0, 0, layer.width, 0)
    fadeX.addColorStop(0, 'rgba(0,0,0,0)')
    fadeX.addColorStop(0.1, 'rgba(0,0,0,1)')
    fadeX.addColorStop(0.9, 'rgba(0,0,0,1)')
    fadeX.addColorStop(1, 'rgba(0,0,0,0)')
    l.fillStyle = fadeX
    l.fillRect(0, 0, layer.width, layer.height)
  }
  ctx.globalAlpha = alpha
  ctx.drawImage(layer, place.x, top)
  ctx.globalAlpha = 1
}

// The title, large on the side away from the content; as a mask it's solid
// white and a little swollen, so the swirl covers the glyphs' glow too.
function drawTitle(ctx: CanvasRenderingContext2D, label: string, hue: string, asMask = false) {
  const { width, height } = ctx.canvas
  const portrait = height > width
  ctx.font = `400 100px ${DISPLAY_FONT}`
  const room = portrait ? width * 0.86 : width * 0.48
  const size = Math.min(height * (portrait ? 0.16 : 0.34), (room / ctx.measureText(label).width) * 100)
  ctx.font = `400 ${size}px ${DISPLAY_FONT}`
  ctx.textAlign = portrait ? 'center' : 'right'
  ctx.textBaseline = 'middle'
  const x = portrait ? width / 2 : width * 0.95
  const y = portrait ? height * 0.2 : height * 0.5
  if (asMask) {
    ctx.fillStyle = '#fff'
    ctx.shadowColor = '#fff'
  }
  else {
    const fill = ctx.createLinearGradient(x - room, y - size / 2, x, y + size / 2)
    fill.addColorStop(0, '#f4eeff')
    fill.addColorStop(0.6, hue)
    fill.addColorStop(1, hue)
    ctx.fillStyle = fill
    ctx.shadowColor = `${hue}d9`
  }
  ctx.shadowBlur = size * (asMask ? 0.3 : 0.18)
  ctx.fillText(label, x, y)
  ctx.shadowBlur = 0
  ctx.fillText(label, x, y)
}

const paintings = new Map<string, HTMLCanvasElement>()
const titleFor = (id: string) => focus.value ?? views.find(v => v.id === id)?.label
const blank = () => {
  const made = document.createElement('canvas')
  made.width = PAINT_WIDTH
  made.height = paintHeight()
  return made
}

// The view behind the irises: the nebula, the eyes without them and, on
// pages, the title. Painted at the screen's aspect so the cover fit doesn't
// crop; content sits over the darkened side: the left on wide screens, the
// bottom on tall ones.
function paintBase(id: string, lids: Pair = [0, 0]) {
  const label = titleFor(id)
  return remember(paintings, `base:${id}:${label}:${lids}:${paintHeight()}`, 24, () => {
    const canvas = blank()
    const { width, height } = canvas
    const ctx = canvas.getContext('2d')!
    const portrait = height > width

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    if (nebula) {
      const scale = Math.max(width / nebula.naturalWidth, height / nebula.naturalHeight)
      ctx.globalAlpha = id === 'home' ? 1 : 0.55
      ctx.drawImage(nebula, (width - nebula.naturalWidth * scale) / 2, (height - nebula.naturalHeight * scale) / 2,
        nebula.naturalWidth * scale, nebula.naturalHeight * scale)
      ctx.globalAlpha = 1
    }

    const eyes = bannerFrame(lids)
    if (eyes) drawOnView(ctx, id, eyes, { feather: true, alpha: placement(id, width, height).alpha })

    const shade = id === 'home'
      ? ctx.createRadialGradient(width * 0.1, height * 0.95, 0, width * 0.1, height * 0.95, width * 0.55)
      : portrait
        ? ctx.createLinearGradient(0, height * 0.62, 0, height * 0.32)
        : ctx.createLinearGradient(width * 0.04, 0, width * 0.58, 0)
    shade.addColorStop(0, 'rgba(0, 0, 0, 0.94)')
    shade.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = shade
    ctx.fillRect(0, 0, width, height)

    if (label) drawTitle(ctx, label, views.find(v => v.id === id)?.tone ?? HOME_TONE)
    return canvas
  })
}

// The irises where the view puts the eyes, faint on pages like the eyes are.
function paintIrises(id: string) {
  return remember(paintings, `irises:${id}:${paintHeight()}`, 24, () => {
    const canvas = blank()
    drawOnView(canvas.getContext('2d')!, id, irises()!, { alpha: placement(id, canvas.width, canvas.height).alpha })
    return canvas
  })
}

function paintIrisMask(id: string, lids: Pair) {
  return remember(paintings, `mask:${id}:${lids}:${paintHeight()}`, 24, () => {
    const canvas = blank()
    drawOnView(canvas.getContext('2d')!, id, bannerMask(lids))
    return canvas
  })
}

// The titles leaving and arriving, so only their particles swirl.
function paintSwirl(labels: (string | undefined)[]) {
  const canvas = blank()
  const ctx = canvas.getContext('2d')!
  for (const label of labels) if (label) drawTitle(ctx, label, '#fff', true)
  return canvas
}

// Without WebGL: the view with its irises at rest, flattened into one image.
function paintStill(id: string) {
  const canvas = blank()
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(paintBase(id), 0, 0)
  if (banner) {
    const iris = blank()
    const i = iris.getContext('2d')!
    i.drawImage(paintIrises(id), 0, 0)
    i.globalCompositeOperation = 'destination-in'
    i.drawImage(paintIrisMask(id, [0, 0]), 0, 0)
    ctx.drawImage(iris, 0, 0)
  }
  return canvas
}

// --- The field -------------------------------------------------------------

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const live = ref(false)
// Without WebGL the painted image stands in, still.
const still = ref<string>()
let renderer: NebulaRenderer | undefined

// What the field shows. Page changes, blinks and title changes all morph to
// the painting of this state; whichever starts lands the one before it at once.
let lids: Pair = [0, 0]
let shownTitle: string | undefined
let changing = false
let blinking = false

function morphTo(seconds: number, swirl: number) {
  const id = view.value
  const label = titleFor(id)
  // only a changing title swirls; the rest of the field changes colour in place
  const swirlMask = swirl && label !== shownTitle ? paintSwirl([shownTitle, label]) : undefined
  shownTitle = label
  return renderer!.morph(paintBase(id, lids), {
    seconds,
    swirl: swirlMask ? swirl : 0,
    swirlMask,
    overlay: banner && { layer: paintIrises(id), mask: paintIrisMask(id, lids) },
  })
}

async function show(id: string) {
  changing = true
  focus.value = undefined
  await assets
  lids = [0, 0]
  if (renderer && live.value) {
    const { anchor, reach } = gazeFor(id)
    renderer.setGaze(anchor, reach)
    await morphTo(1.6, 1)
  }
  else {
    still.value = paintStill(id).toDataURL('image/jpeg', 0.85)
  }
  if (id !== view.value) return
  changing = false
  settle()
}

// A title borrowed while the field was busy lands once it's free.
function settle() {
  if (renderer && live.value && !changing && !blinking && titleFor(view.value) !== shownTitle) morphTo(0.8, 0.45)
}

type Frame = [left: number, right: number, ms: number]
const BLINK: Frame[] = [[0.5, 0.5, 35], [1, 1, 35], [1, 1, 70], [0.45, 0.45, 45], [0, 0, 70]]
// The easter egg: poke an eye and it shuts first, the other catching up late.
const LOPSIDED: Frame[] = [[0.6, 0, 30], [1, 0.25, 30], [1, 0.7, 40], [1, 1, 70], [0.35, 1, 45], [0, 0.5, 45], [0, 0, 60]]
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function blink(frames: Frame[]) {
  if (!renderer || !live.value || reduced.value || changing || blinking) return
  const id = view.value
  blinking = true
  try {
    for (const [left, right, ms] of frames) {
      // a page change took the field over
      if (changing || id !== view.value) return
      lids = [left, right]
      await morphTo(ms / 1000, 0)
    }
  }
  finally {
    blinking = false
    lids = [0, 0]
  }
  settle()
}

let blinkTimer: ReturnType<typeof setTimeout> | undefined
function scheduleBlink() {
  blinkTimer = setTimeout(async () => {
    if (!document.hidden) {
      await blink(BLINK)
      if (Math.random() < 0.2) {
        await wait(140)
        await blink(BLINK)
      }
    }
    scheduleBlink()
  }, 2500 + Math.random() * 4000)
}

useEventListener('click', (event: MouseEvent) => {
  if (!banner || (event.target as Element).closest('a, button, input, textarea, select, label')) return
  const [bx, by] = screenToBanner([event.clientX, event.clientY])
  const poked = EYES.findIndex(eye => bx >= eye.white[0] - 10 && bx <= eye.white[1] + 10
    && by >= yAt(eye.T, bx) - 15 && by <= yAt(eye.L, bx) + 15)
  if (poked < 0) return
  blink(LOPSIDED.map(([lead, trail, ms]) => poked === 0 ? [lead, trail, ms] : [trail, lead, ms]))
})

onMounted(async () => {
  await assets
  shownTitle = titleFor(view.value)
  renderer = createNebulaRenderer(canvas.value!, {
    src: paintBase(view.value).toDataURL('image/jpeg', 0.9),
    reduced: reduced.value,
    onStruggle: () => {
      renderer?.dispose()
      live.value = false
      show(view.value)
    },
  })
  renderer.ready
    .then(() => {
      live.value = true
      const { anchor, reach } = gazeFor(view.value)
      renderer!.setGaze(anchor, reach)
      // hands the renderer the irises, which the first image leaves out
      morphTo(0.3, 0)
      scheduleBlink()
    })
    .catch(() => show(view.value))
})

watch(view, id => show(id))
watch(focus, () => {
  if (renderer && live.value && !changing && !blinking) morphTo(0.8, 0.45)
})
watch(reduced, value => renderer?.setReduced(value))
useEventListener('resize', useDebounceFn(() => show(view.value), 400))
onBeforeUnmount(() => {
  clearTimeout(blinkTimer)
  renderer?.dispose()
})
</script>

<template>
  <div class="field" :class="[`view-${view}`, { 'is-live': live }]" :style="{ '--accent': tone }">
    <canvas ref="canvas" aria-hidden="true" class="field-canvas" />
    <Transition name="still">
      <img v-if="still && !live" :key="still" :src="still" alt="" aria-hidden="true" class="field-still">
    </Transition>

    <header class="bar">
      <NuxtLink to="/" class="mark" :class="view === 'home' && 'is-hidden'">Jordan Jones</NuxtLink>
      <nav aria-label="Sections">
        <ul class="flex gap-5 sm:gap-8">
          <li v-for="item in views" :key="item.id">
            <NuxtLink :to="item.to" class="nav-link" :aria-current="view === item.id ? 'page' : undefined">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <slot />
  </div>
</template>

<style>
/* Shared by the field's pages, which render inside it. */
.field {
  --fg: #efebfa;
  --fg-2: #b2acc9;
  --fg-3: #7c7697;
  --accent: #c2a5ff;
  /* The hues from the banner: who I am, the work, the side work. */
  --tone-who: #d9c6ff;
  --tone-work: #5fb2ff;
  --tone-side: #ff9b4a;
  --rule: rgb(194 165 255 / 0.18);

  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: #000;
  color: var(--fg);
  font-family: var(--font-sans);
  color-scheme: dark;
}

.field-canvas,
.field-still {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.field-still {
  object-fit: cover;
  opacity: 0.55;
}

.still-enter-active,
.still-leave-active {
  transition: opacity 900ms ease;
}

.still-leave-active {
  position: fixed;
}

.still-enter-from,
.still-leave-to {
  opacity: 0;
}

.bar {
  position: absolute;
  inset: 0 0 auto;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1rem, 3vh, 2rem) clamp(1.25rem, 4vw, 3.5rem);
}

.mark {
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 1.15rem;
  transition: opacity 500ms;
}

.mark.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* A sentence in one of the hues colours its phrases and leaves the rest as is. */
.tone-who { --tone: var(--tone-who); }
.tone-work { --tone: var(--tone-work); }
.tone-side { --tone: var(--tone-side); }

:is(.tone-who, .tone-work, .tone-side) > span {
  color: var(--tone);
}

.nav-link {
  position: relative;
  font-size: 0.95rem;
  color: var(--fg-2);
  transition: color 200ms;
}

.nav-link:hover,
.nav-link:focus-visible,
.nav-link[aria-current='page'] {
  color: var(--fg);
}

/* The current section's marker is a single bright particle. */
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -0.6rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px 1px var(--accent);
  translate: -50% 0;
  scale: 0;
  transition: scale 300ms cubic-bezier(.3, 1.6, .5, 1), background 400ms, box-shadow 400ms;
}

.nav-link[aria-current='page']::after {
  scale: 1;
}

.nav-link:focus-visible,
.mark:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 6px;
}

/* A page's content column, over the darkened side of the field. */
.column {
  position: absolute;
  z-index: 4;
  top: 0;
  bottom: 0;
  left: 0;
  width: min(38rem, 46vw);
  overflow-y: auto;
  padding: clamp(6rem, 16vh, 9rem) clamp(1.25rem, 4vw, 3.5rem) 4rem;
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}

@media (max-aspect-ratio: 1/1) {
  .column {
    width: auto;
    right: 0;
    padding-top: 36dvh;
  }
}

.column h1 {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--fg-3);
  margin-bottom: 1.5rem;
}

/* The field already writes the title large; the heading is for when it can't. */
.is-live .column h1 {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

/* Content leaves fast, then arrives as the particles settle into the new title. */
.column-leave-active {
  transition: opacity 220ms ease-in, translate 220ms ease-in;
}

.column-leave-to {
  opacity: 0;
  translate: -0.75rem 0;
}

.column-enter-active > * {
  transition: opacity 600ms ease-out, translate 700ms cubic-bezier(.2, .8, .2, 1);
  transition-delay: calc(450ms + var(--n, 0) * 70ms);
}

.column-enter-from > * {
  opacity: 0;
  translate: 1.25rem 0;
}

.column > :nth-child(2) { --n: 1; }
.column > :nth-child(3) { --n: 2; }
.column > :nth-child(4) { --n: 3; }
.column > :nth-child(n + 5) { --n: 4; }

@media (prefers-reduced-motion: reduce) {
  .column-leave-active,
  .column-enter-active > *,
  .still-enter-active,
  .still-leave-active {
    transition: none;
  }
}

.field .lead {
  font-size: clamp(1.2rem, 1.6vw, 1.45rem);
  line-height: 1.45;
  color: var(--fg);
}

.field .prose-p {
  margin-top: 1rem;
  max-width: 60ch;
  line-height: 1.65;
  color: var(--fg-2);
}

.field .inline-link {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 3px;
}

.field .list {
  display: flex;
  flex-direction: column;
}

.field .item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--rule);
}

.field .item:first-child {
  padding-top: 0;
}

.field .item-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--fg);
  transition: color 200ms;
}

.field a.item:hover .item-title,
.field a.item:focus-visible .item-title {
  color: var(--accent);
}

.field a.item:focus-visible {
  outline: none;
}

.field .item-text {
  max-width: 60ch;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--fg-2);
}

.field .item-meta {
  font-size: 0.8rem;
  color: var(--fg-3);
}

.field .group-label {
  margin: 2.5rem 0 1rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--fg);
}
</style>
