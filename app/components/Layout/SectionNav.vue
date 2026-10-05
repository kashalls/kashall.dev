<script setup lang="ts">
const { reduced } = useMotionPreference()
const active = ref<string>(homeSections[0].id)

function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced.value ? 'auto' : 'smooth', block: 'start' })
}

let observer: IntersectionObserver | undefined

onMounted(() => {
    // The page scrolls inside the layout's frame, not the window. The bottom
    // margin makes a section "active" once it reaches the top 40% of it.
    observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) active.value = entry.target.id
        }
    }, { root: document.getElementById('content-frame'), rootMargin: '0px 0px -60% 0px' })

    for (const { id } of homeSections) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
    }
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
    <nav class="flex items-center gap-1" aria-label="Page sections">
        <UButton v-for="section in homeSections" :key="section.id" :label="section.label" :icon="section.icon"
            size="xs" color="primary" :variant="active === section.id ? 'soft' : 'ghost'"
            :aria-current="active === section.id ? 'true' : undefined" @click="go(section.id)" />
    </nav>
</template>
