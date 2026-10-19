<script setup lang="ts">
// Shares /api/status with the home page's Status panel; client-only so
// prerendered pages don't bake in build-time status.
const { data: services, refresh } = useFetch('/api/status', { server: false, lazy: true })

let timer: ReturnType<typeof setInterval>
onMounted(() => {
    timer = setInterval(refresh, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const down = computed(() => services.value?.filter(service => service.up === false).length ?? 0)
</script>

<template>
    <UButton v-if="services?.length" to="/#live" color="neutral" variant="ghost"
        class="text-muted hover:text-highlighted"
        :aria-label="down ? `${down} of ${services.length} services down` : 'All systems normal'">
        <span class="relative flex size-2.5">
            <span class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                :class="down ? 'bg-red-400' : 'bg-green-400'" />
            <span class="relative inline-flex size-2.5 rounded-full" :class="down ? 'bg-red-400' : 'bg-green-400'" />
        </span>
        <span class="hidden md:inline">{{ down ? `${down} down` : 'All systems normal' }}</span>
    </UButton>
</template>
