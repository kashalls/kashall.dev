<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { WowCharacter } from '~/types/games'

const props = defineProps<{ character: WowCharacter }>()

// Blizzard's in-game class colours.
const classColors: Record<string, string> = {
    'Death Knight': '#C41E3A',
    'Demon Hunter': '#A330C9',
    Druid: '#FF7C0A',
    Evoker: '#33937F',
    Hunter: '#AAD372',
    Mage: '#3FC7EB',
    Monk: '#00FF98',
    Paladin: '#F48CBA',
    Priest: '#FFFFFF',
    Rogue: '#FFF468',
    Shaman: '#0070DD',
    Warlock: '#8788EE',
    Warrior: '#C69B6D',
}

const flavors: Record<string, string> = {
    retail: 'Retail',
    classicann: 'TBC Anniversary',
    classic1x: 'Classic Era',
    classic: 'Classic',
}

const c = computed(() => props.character)
const classColor = computed(() => classColors[c.value.class])
const flavor = computed(() => flavors[c.value.flavor] ?? c.value.flavor)
const fmt = (n: number) => new Intl.NumberFormat('en').format(Math.round(n))
const lastLogin = useTimeAgo(() => c.value.last_login)
</script>

<template>
    <GamesBanner :background="c.media.main" :figure="c.media.main ? undefined : c.media.main_raw"
        :accent="classColor">
        <template #identity>
            <img v-if="c.media.avatar" :src="c.media.avatar" :alt="c.name"
                class="h-16 w-16 shrink-0 rounded-full border-2 bg-black object-cover"
                :style="{ borderColor: classColor }" />
            <div class="min-w-0">
                <UBadge :label="flavor" color="neutral" variant="subtle" size="sm" class="mb-1" />
                <h2 class="truncate font-wow text-3xl font-bold" :style="{ color: classColor }">{{ c.name }}</h2>
                <p class="truncate text-sm text-neutral-200">
                    Level {{ c.level }} {{ c.race }} {{ c.spec }} {{ c.class }}
                </p>
                <p class="truncate text-xs text-neutral-400">
                    <template v-if="c.guild">&lt;{{ c.guild }}&gt; · </template>{{ c.realm }}
                </p>
            </div>
        </template>

        <template #stats>
            <div class="grid grid-cols-3 gap-2">
                <GamesStat label="Item Level" :value="c.item_level" />
                <GamesStat v-if="c.mythic_rating" label="M+ Rating" :value="fmt(c.mythic_rating.rating)"
                    :color="c.mythic_rating.color" />
                <GamesStat v-else label="Faction" :value="c.faction" />
                <GamesStat v-if="c.achievement_points" label="Achievements" :value="fmt(c.achievement_points)" />
                <GamesStat v-else label="Level" :value="c.level" />
            </div>
        </template>

        <template #details>
            <dl class="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                <div>
                    <dt class="text-xs text-neutral-400">Faction</dt>
                    <dd class="text-neutral-100">{{ c.faction }}</dd>
                </div>
                <div>
                    <dt class="text-xs text-neutral-400">Realm</dt>
                    <dd class="text-neutral-100">{{ c.realm }}</dd>
                </div>
                <div v-if="c.guild">
                    <dt class="text-xs text-neutral-400">Guild</dt>
                    <dd class="text-neutral-100">{{ c.guild }}</dd>
                </div>
                <div>
                    <dt class="text-xs text-neutral-400">Last seen</dt>
                    <dd class="text-neutral-100">{{ lastLogin }}</dd>
                </div>
            </dl>
        </template>
    </GamesBanner>
</template>
