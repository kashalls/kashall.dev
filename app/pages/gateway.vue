<script setup lang="ts">
// Fallback page for hostnames that resolve to the gateway with no service
// configured behind them. Point the gateway's default backend here.
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

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
    <main class="column">
        <h1 class="doc-title">No service configured</h1>
        <p class="lead mt-4">This hostname is resolving to one of Jordan's gateway endpoints, but there's no service wired up behind it yet.</p>
        <p class="mt-8 text-sm text-(--fg-3)">Hostname</p>
        <p class="mt-1 break-all font-mono text-(--fg)">{{ host }}</p>
        <p class="mt-8 flex gap-6 text-sm">
            <button type="button" class="text-(--accent) hover:text-(--fg)" @click="openContact">Contact the operator</button>
            <NuxtLink to="/" class="text-(--fg-3) hover:text-(--fg)">Homepage</NuxtLink>
        </p>
    </main>
</template>
