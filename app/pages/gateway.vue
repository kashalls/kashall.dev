<script setup lang="ts">
// Fallback page for hostnames that resolve to the gateway with no service
// configured behind them. Point the gateway's default backend here.
const url = useRequestURL()
const host = computed(() => url.host)
const { openContact } = useContact()

useSeoMeta({
    title: 'Gateway — No Service Configured',
    description: 'This hostname is resolving to a gateway endpoint with no configured service.',
    ogDescription: 'This hostname is resolving to a gateway endpoint with no configured service.',
})
// Served for any unconfigured hostname, so keep it out of search indexes.
useRobotsRule(false)
</script>

<template>
    <StatusWindows code="502" title="No Service Configured"
        description="This hostname is resolving to one of Jordan's gateway endpoints, but there's no service wired up behind it yet.">
        <template #extra>
            <div class="rounded-lg border border-gray-800 bg-zinc-800/50 px-3 py-2 text-xs">
                <p class="text-slate-500">Hostname</p>
                <p class="break-all font-mono text-slate-200">{{ host }}</p>
            </div>
        </template>

        <UButton icon="i-ph-envelope-simple" color="primary" @click="openContact">Contact the operator</UButton>
        <UButton to="/" icon="i-ph-house" color="primary" variant="ghost">Homepage</UButton>
    </StatusWindows>
</template>
