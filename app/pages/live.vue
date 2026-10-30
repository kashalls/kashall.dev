<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

import type { LanyardData } from '~/types/lanyard'
import type { OverwatchPlayer, WowCharacter } from '~/types/games'

const lanyard = useState<LanyardData>('lanyard')
const { data: services } = useFetch('/api/status', { server: false, lazy: true })

// Client-only so the prerendered page doesn't bake in stats from build time.
const GAMES_API = 'https://api.ok8.sh'
const { data: wow, pending: wowPending } = useFetch<{ characters: WowCharacter[] }>(`${GAMES_API}/wow/characters`, { server: false, lazy: true })
const { data: ow, pending: owPending } = useFetch<{ players: OverwatchPlayer[] }>(`${GAMES_API}/overwatch/players`, { server: false, lazy: true })
const characters = computed(() => wow.value?.characters ?? [])
const players = computed(() => ow.value?.players ?? [])

const percent = (value: number | null) => value === null ? 'n/a' : `${(value * 100).toFixed(value === 1 ? 0 : 2)}%`
const activities = computed(() => (lanyard.value?.activities ?? []).filter(a => ![2, 4, 6].includes(a.type)))
const down = computed(() => services.value?.filter(service => service.up === false) ?? [])
</script>

<template>
  <main class="column">
    <h1 class="page-name">Live</h1>
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

    <h2 class="group-label">Games</h2>
    <ClientOnly>
      <p v-if="!characters.length && !players.length" class="item-text">
        {{ wowPending || owPending ? 'Looking up my characters.' : "The game APIs didn't return anything. Check back in a bit." }}
      </p>
      <div v-else class="flex flex-col gap-4">
        <GamesWowCard v-for="c in characters" :key="`${c.flavor}-${c.realm}-${c.name}`" :character="c" />
        <GamesOverwatchCard v-for="p in players" :key="p.battletag" :player="p" />
      </div>
      <template #fallback>
        <p class="item-text">Looking up my characters.</p>
      </template>
    </ClientOnly>
  </main>
</template>
