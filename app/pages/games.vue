<script setup lang="ts">
import type { OverwatchPlayer, WowCharacter } from '~/types/games'

const API = 'https://api.ok8.sh'

useHead({ title: 'Games — Jordan Jones' })
defineOgImage('Default', {
    title: 'Games',
    description: 'Characters and careers from the games I play.',
})

// Client-only (here and via <ClientOnly> below) so the prerendered page
// doesn't bake in stats from build time.
const { data: wow, pending: wowPending } = useFetch<{ characters: WowCharacter[] }>(`${API}/wow/characters`, { server: false, lazy: true })
const { data: ow, pending: owPending } = useFetch<{ players: OverwatchPlayer[] }>(`${API}/overwatch/players`, { server: false, lazy: true })

const pending = computed(() => wowPending.value || owPending.value)
const empty = computed(() => !pending.value && !wow.value?.characters.length && !ow.value?.players.length)
</script>

<template>
    <section class="container mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-6 md:px-6">
        <header class="mb-2">
            <h1 class="text-3xl font-bold text-white">Games</h1>
            <p class="text-sm text-neutral-400">What I've been playing, pulled live from Blizzard.</p>
        </header>

        <ClientOnly>
            <template v-if="pending">
                <USkeleton v-for="i in 2" :key="i" class="h-52 rounded-lg bg-white/5" />
            </template>

            <GamesWowCard v-for="c in wow?.characters" :key="`${c.flavor}-${c.realm}-${c.name}`" :character="c" />
            <GamesOverwatchCard v-for="p in ow?.players" :key="p.battletag" :player="p" />

            <UEmpty v-if="empty" icon="i-ph-game-controller" title="Nothing to show right now"
                description="The game APIs didn't return anything. Check back in a bit." variant="naked" />

            <template #fallback>
                <USkeleton v-for="i in 2" :key="i" class="h-52 rounded-lg bg-white/5" />
            </template>
        </ClientOnly>
    </section>
</template>
