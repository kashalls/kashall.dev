<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

const { reduced } = useMotionPreference()
const tab = useHomeTab()
const inAbout = ref(true)
const active = computed(() => inAbout.value ? 'about' : tab.value)

// One shared highlight that slides to the active button, sized from its box.
const nav = useTemplateRef<HTMLElement>('nav')
const indicator = ref<{ left: number, width: number } | null>(null)

function measure() {
    const el = nav.value?.querySelector<HTMLElement>(`[data-section="${active.value}"]`)
    indicator.value = el?.offsetWidth ? { left: el.offsetLeft, width: el.offsetWidth } : null
}

watch(active, measure, { flush: 'post' })
useResizeObserver(nav, measure)

let observer: IntersectionObserver | undefined

onMounted(() => {
    // The page scrolls inside the layout's frame, not the window. The bottom
    // margin makes a section "active" once it reaches the top 40% of it.
    observer = new IntersectionObserver((entries) => {
        for (const entry of entries) inAbout.value = !entry.isIntersecting
    }, { root: document.getElementById('content-frame'), rootMargin: '0px 0px -60% 0px' })

    const tabs = document.getElementById('home-tabs')
    if (tabs) observer.observe(tabs)
    measure()
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
    <nav ref="nav" class="relative flex items-center gap-1" aria-label="Page sections">
        <span v-if="indicator" aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 left-0 rounded-md bg-primary/10 transition-[translate,width] duration-300 ease-out"
            :style="{ translate: `${indicator.left}px 0`, width: `${indicator.width}px` }" />
        <UButton v-for="section in homeSections" :key="section.id" :data-section="section.id" :label="section.label"
            :icon="section.icon" size="sm" color="primary" variant="ghost"
            :class="active === section.id && 'hover:bg-transparent active:bg-transparent'"
            :ui="{ leadingIcon: ['transition-transform duration-300', active === section.id && 'scale-110'] }"
            :aria-current="active === section.id ? 'true' : undefined" @click="showHomeSection(section.id, reduced)" />
    </nav>
</template>
