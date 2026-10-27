<script setup>
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'

useProximityGlow()

const route = useRoute()

// Posts pages glow in their section's colour (primary on search).
const { current: postsSection } = await useBlogNavigation()
const postsGlow = computed(() => route.path.startsWith('/posts') && [
  'bg-radial-[at_100%_0%] to-transparent to-60%',
  blogSection(postsSection.value)?.accent.glow ?? 'from-primary/15',
])

// Pages are prerendered, so messages load in the browser. Open pages pick up
// changes on navigation, when the tab comes back into view, and every five
// minutes while it's visible; idle hidden tabs cost nothing.
const { refresh: refreshMessages } = useSiteMessages()
if (import.meta.client) {
  const visibility = useDocumentVisibility()
  onMounted(refreshMessages)
  watch(() => route.path, refreshMessages)
  watch(visibility, (state) => { if (state === 'visible') refreshMessages() })
  useIntervalFn(() => { if (visibility.value === 'visible') refreshMessages() }, 5 * 60_000)
}

const { reduced } = useMotionPreference()
const { enabled: readableFont } = useReadableFont()
const { size: textSize } = useTextSize()
if (import.meta.client) {
  watchEffect(() => document.documentElement.classList.toggle('reduce-motion', reduced.value))
  watchEffect(() => document.documentElement.classList.toggle('readable-font', readableFont.value))
  watchEffect(() => { document.documentElement.dataset.textSize = textSize.value })
}

// Pages are prerendered, so apply the saved font and text size before first
// paint instead of swapping them once the app hydrates.
useHead({
  script: [{
    innerHTML: `try{if(localStorage.getItem('${READABLE_FONT_KEY}')==='true')document.documentElement.classList.add('readable-font');var s=localStorage.getItem('${TEXT_SIZE_KEY}');if(s)document.documentElement.dataset.textSize=s}catch(e){}`,
  }],
})
</script>

<template>
  <div class="h-dvh relative overflow-hidden p-2 bg-slate-200 dark:bg-black">
    <slot name="background">
      <div class="background fixed top-0 left-0 right-0 h-screen" />
    </slot>
    <div
      class="grid md:size-full relative h-full rounded-lg overflow-hidden border border-default transition-all duration-500 shadow-2xl grid-rows-[3.5rem_1fr_3rem] grid-columns-[2.5rem_1fr] [grid-template-areas:'header_header_header''content_content_content''bottom_bottom_bottom'] [grid-template-columns:0rem_1fr_0rem]">
      <LayoutHeader />

      <!-- A scroll container's background stays put as its content scrolls, so
           the posts' glow stays in view while reading. -->
      <div class="h-auto overflow-x-hidden overflow-y-scroll scroll p-1 [grid-area:content]" id="content-frame"
        :class="postsGlow">
        <LayoutMaintenanceBanner />
        <slot />
      </div>

      <footer
        class="flex border-t border-default bg-gradient-to-tr from-white/25 to-white/25 dark:from-[#0e0c12]/25 dark:to-[#0e0f0f]/25 [grid-area:bottom]">
        <!-- Same width and columns as the header. -->
        <div class="mx-auto grid w-full max-w-[96rem] grid-cols-[1fr_auto] items-center gap-2 px-2 md:px-4 lg:grid-cols-[1fr_auto_1fr]">
          <div class="flex items-center gap-1">
            <LayoutStatusPill />
          </div>
          <div v-if="route.path === '/'" class="hidden lg:flex">
            <LayoutSectionNav />
          </div>
          <div class="col-start-2 flex items-center justify-self-end lg:col-start-3">
            <LayoutVisitCount />
            <LayoutBuildInfo />
          </div>
        </div>
      </footer>

      <ContactDialog />
    </div>
  </div>
</template>


<style>
html.reduce-motion *,
html.reduce-motion *::before,
html.reduce-motion *::after {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}

html[data-text-size="sm"] { font-size: 87.5%; }
html[data-text-size="lg"] { font-size: 112.5%; }
html[data-text-size="xl"] { font-size: 125%; }

html.readable-font {
  --font-sans: "OpenDyslexic", ui-sans-serif, system-ui, sans-serif;
  --font-display: "OpenDyslexic", ui-sans-serif, system-ui, sans-serif;
  --font-body: "OpenDyslexic", ui-sans-serif, system-ui, sans-serif;
  --font-stat: "OpenDyslexic", ui-sans-serif, system-ui, sans-serif;
}

#content-frame {
  scrollbar-width: thin;
  scrollbar-color: oklch(var(--color-primary-DEFAULT)) transparent;
}

.background {
  &::after {
    content: '';
    z-index: 10;
    position: absolute;
    top: 0;
    left: 50%;
    height: 100vw;
    width: 200vw;
    background: radial-gradient(rgb(var(--color-primary-700)), rgb(var(--color-primary-600) / 0) 70%);
    transform: translateX(-50%) translateY(50vh);
    opacity: 0.5;
  }
}
</style>