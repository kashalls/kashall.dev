<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

import type { LanyardData } from '~/types/lanyard'

const lanyard = useState<LanyardData>('lanyard')
const { data: services } = useFetch('/api/status', { server: false, lazy: true })

const percent = (value: number | null) => value === null ? 'n/a' : `${(value * 100).toFixed(value === 1 ? 0 : 2)}%`
const activities = computed(() => (lanyard.value?.activities ?? []).filter(a => ![2, 4, 6].includes(a.type)))
const down = computed(() => services.value?.filter(service => service.up === false) ?? [])
</script>

<template>
  <main class="column">
    <h1>Live</h1>
    <ClientOnly>
      <p class="lead">
        <template v-if="!lanyard">Connecting to Discord.</template>
        <template v-else-if="lanyard.listening_to_spotify && lanyard.spotify">Listening to <span class="text-[#1ed760]">{{ lanyard.spotify.song }}</span> by {{ lanyard.spotify.artist }}.</template>
        <template v-else-if="activities[0]">{{ ActivityType[activities[0].type] }} <span class="text-(--accent)">{{ activities[0].name }}</span>.</template>
        <template v-else><span :style="{ color: statusColor(lanyard.discord_status) }">{{ STATUS[lanyard.discord_status]?.label ?? 'Offline' }}</span> on Discord, not doing anything in particular.</template>
      </p>
    </ClientOnly>

    <h2 class="group-label">The homelab</h2>
    <p v-if="!services" class="item-text">Checking the cluster's probes.</p>
    <template v-else>
      <p class="item-text mb-5">{{ down.length ? `${down.length} of ${services.length} services are down.` : 'Every service is answering.' }}</p>
      <ul class="list">
        <li v-for="service in services" :key="service.key" class="item">
          <span class="flex items-baseline justify-between gap-4">
            <span class="item-title" :class="service.up === false && 'text-[#ff7a6b]'">{{ service.label }}</span>
            <span class="item-meta tabular-nums">{{ percent(service.uptime['30d']) }} over 30 days</span>
          </span>
          <span class="flex h-1.5 gap-px" aria-hidden="true">
            <span v-for="check in service.checks" :key="check.at" class="flex-1 rounded-full"
              :class="check.ok ? 'bg-(--accent)/45' : 'bg-[#ff7a6b]'" />
          </span>
        </li>
      </ul>
    </template>
  </main>
</template>
