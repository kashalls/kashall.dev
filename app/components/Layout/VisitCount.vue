<script setup lang="ts">
// Session storage, so each browser session counts one visit however many pages it loads.
const COUNTED_KEY = 'kashall-visit-counted'

const count = ref<number | null>(null)

onMounted(async () => {
    let counted = false
    try {
        counted = sessionStorage.getItem(COUNTED_KEY) === 'true'
    } catch {}
    const result = await $fetch<{ count: number }>('/api/visits', { method: counted ? 'GET' : 'POST' }).catch(() => null)
    if (!result) return
    count.value = result.count
    try {
        sessionStorage.setItem(COUNTED_KEY, 'true')
    } catch {}
})
</script>

<template>
    <UTooltip v-if="count !== null" text="Visits">
        <span class="flex items-center gap-1.5 px-2 font-mono text-sm text-dimmed">
            <UIcon name="i-ph-eye" />
            {{ count.toLocaleString() }}
        </span>
    </UTooltip>
</template>
