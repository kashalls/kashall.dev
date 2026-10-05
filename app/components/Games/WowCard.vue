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

// The Armory's own per-class backdrop. Not part of the API, so it's a URL
// pattern on Blizzard's render CDN (e.g. armory_bg_class_death_knight.jpg).
// Official logos from Blizzard's CDN. Retail's is the current expansion, so
// it needs bumping when a new one launches. Its 600x800 canvas holds the
// emblem at x 156-444, y 519-744, so it's cropped with background sizing.
const MIDNIGHT_LOGO = 'https://blz-contentstack-images.akamaized.net/v3/assets/blta8f9a8e092360c6c/blt412ed61d1a5c7af1/689f9e92e08c838e86c4c8e9/12.0_Logo_enUS.png'
const CLASSIC_LOGO = 'https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt8b3f311b12c5b391/6a9222612437ed42f9d486c2/wow-classic.png'

const classBackground = computed(() =>
    `https://render.worldofwarcraft.com/profile-backgrounds/v2/armory_bg_class_${c.value.class.toLowerCase().replace(/ /g, '_')}.jpg`)
</script>

<template>
    <GamesBanner :title="c.flavor === 'retail' ? 'World of Warcraft' : 'World of Warcraft Classic'"
        icon="i-ph-sword" :background="c.media.main ?? classBackground">
        <template #logo>
            <div v-if="c.flavor === 'retail'" role="img" aria-label="World of Warcraft: Midnight"
                class="h-20 w-26 bg-no-repeat md:h-28 md:w-36"
                :style="{ backgroundImage: `url(${MIDNIGHT_LOGO})`, backgroundSize: '208%', backgroundPosition: '50% 90%' }" />
            <NuxtImg v-else :src="CLASSIC_LOGO" alt="World of Warcraft Classic" class="w-28 md:w-36" />
        </template>

        <template #identity>
            <UChip :show="!!c.spec_icon" position="bottom-right" inset :style="{ '--class-color': classColor }"
                :ui="{ base: 'size-7 rounded bg-black p-0 ring-0 border border-(--class-color) overflow-hidden' }">
                <UAvatar :src="c.media.avatar" :alt="c.name"
                    class="size-16 border-2 border-(--class-color) bg-black" />
                <template #content>
                    <NuxtImg :src="c.spec_icon" :alt="c.spec" :title="c.spec" class="size-full" />
                </template>
            </UChip>
            <div class="min-w-0">
                <UBadge v-if="c.flavor !== 'retail'" :label="flavor" color="neutral" variant="subtle" size="sm" class="mb-1" />
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
