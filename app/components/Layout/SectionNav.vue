<script setup lang="ts">
const { reduced } = useMotionPreference()
const tab = useHomeTab()
const inAbout = ref(true)
const active = computed(() => inAbout.value ? 'about' : tab.value)

let observer: IntersectionObserver | undefined

onMounted(() => {
    // The page scrolls inside the layout's frame, not the window. The bottom
    // margin makes a section "active" once it reaches the top 40% of it.
    observer = new IntersectionObserver((entries) => {
        for (const entry of entries) inAbout.value = !entry.isIntersecting
    }, { root: document.getElementById('content-frame'), rootMargin: '0px 0px -60% 0px' })

    const tabs = document.getElementById('home-tabs')
    if (tabs) observer.observe(tabs)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
    <nav class="flex items-center gap-1" aria-label="Page sections">
        <UButton v-for="section in homeSections" :key="section.id" :label="section.label" :icon="section.icon"
            size="sm" color="primary" :variant="active === section.id ? 'soft' : 'ghost'"
            :aria-current="active === section.id ? 'true' : undefined" @click="showHomeSection(section.id, reduced)" />
    </nav>
</template>
