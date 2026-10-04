<script setup lang="ts">
import type { OverwatchPlayer } from '~/types/games'

const props = defineProps<{ player: OverwatchPlayer }>()
const p = computed(() => props.player)

const hours = (seconds: number) => `${new Intl.NumberFormat('en').format(Math.round(seconds / 3600))}h`
const heroName = (key: string) => key.split('-').map(w => w[0]!.toUpperCase() + w.slice(1)).join(' ')
const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1)
const owValue = 'font-overwatch text-3xl font-semibold italic leading-none'
</script>

<template>
    <GamesBanner :background="p.namecard" accent="#f99e1a">
        <template #identity>
            <img v-if="p.avatar" :src="p.avatar" :alt="p.username"
                class="h-16 w-16 shrink-0 rounded-full border-2 border-[#f99e1a] bg-black object-cover" />
            <div class="min-w-0">
                <UBadge label="Overwatch" color="neutral" variant="subtle" size="sm" class="mb-1" />
                <h2 class="truncate font-overwatch text-4xl font-semibold uppercase italic leading-none text-white">{{ p.username }}</h2>
                <p v-if="p.title" class="truncate text-sm text-neutral-200">{{ p.title }}</p>
                <p class="flex items-center gap-1.5 truncate text-xs text-neutral-400">
                    <img v-if="p.endorsement_frame" :src="p.endorsement_frame"
                        :alt="`Endorsement level ${p.endorsement}`" :title="`Endorsement level ${p.endorsement}`"
                        class="h-6 w-6" />
                    <template v-else-if="p.endorsement">Endorsement {{ p.endorsement }}</template>
                    <template v-if="p.endorsement && p.season"> · </template>
                    <template v-if="p.season">Season {{ p.season }}</template>
                </p>
            </div>
        </template>

        <template #stats>
            <div class="flex flex-col gap-2">
                <div v-if="p.ranks.length" class="flex flex-wrap gap-2">
                    <div v-for="r in p.ranks" :key="r.role"
                        class="flex items-center gap-2 rounded border border-white/10 bg-black/40 px-2 py-1 backdrop-blur">
                        <img :src="r.role_icon" :alt="r.role" class="h-4 w-4" />
                        <img :src="r.rank_icon" :alt="r.division" :title="`${cap(r.division)} ${r.tier}`" class="h-7 w-7" />
                        <img v-if="r.tier_icon" :src="r.tier_icon" :alt="`Tier ${r.tier}`" class="h-6 w-auto" />
                        <span v-else class="font-overwatch text-xl uppercase italic leading-none text-white">{{ cap(r.division) }} {{ r.tier }}</span>
                    </div>
                </div>
                <div v-if="p.stats" class="grid grid-cols-3 gap-2">
                    <GamesStat :value-class="owValue" label="Win Rate" :value="`${p.stats.winrate.toFixed(1)}%`" />
                    <GamesStat :value-class="owValue" label="KDA" :value="p.stats.kda.toFixed(2)" />
                    <GamesStat :value-class="owValue" label="Played" :value="hours(p.stats.time_played)" />
                </div>
                <p v-if="!p.ranks.length && !p.stats" class="text-sm text-neutral-400">Career profile is private.</p>
            </div>
        </template>

        <template v-if="p.top_heroes.length" #details>
            <p class="mb-2 text-xs text-neutral-400">Most played</p>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div v-for="h in p.top_heroes" :key="h.hero"
                    class="flex items-center justify-between rounded border border-white/10 bg-black/40 px-3 py-2 text-sm">
                    <span class="font-overwatch text-xl uppercase italic leading-none text-white">{{ heroName(h.hero) }}</span>
                    <span class="text-neutral-300">{{ hours(h.time_played) }} · {{ h.winrate.toFixed(0) }}%</span>
                </div>
            </div>
        </template>
    </GamesBanner>
</template>
