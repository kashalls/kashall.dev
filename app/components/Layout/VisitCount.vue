<script setup lang="ts">
const count = ref<number | null>(null)

// The server decides whether this page load is a new visit.
onMounted(async () => {
    const result = await $fetch<{ count: number }>('/api/visits', { method: 'POST' }).catch(() => null)
    if (result) count.value = result.count
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
