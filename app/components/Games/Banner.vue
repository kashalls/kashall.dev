<script setup lang="ts">
// Shared wide card shell for /games: a background image under a dark
// gradient, identity on the left, stats on the right, and an optional
// "View More" drawer.
defineProps<{ background?: string; figure?: string; accent?: string }>()
const open = ref(false)
</script>

<template>
    <article
        class="relative overflow-hidden rounded-lg border border-gray-900 bg-[#0e0c12] font-stat transition-[border-color,box-shadow] duration-300 hover:border-primary-800/50 hover:shadow-lg hover:shadow-primary-950/40">
        <img v-if="background" :src="background" alt="" loading="lazy"
            class="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/90" />
        <!-- Blizzard's transparent renders are 1600x1200 with the character
             filling roughly y 33-82%, so scale and offset to fit it to the
             card's height, in the gap between identity and stats. -->
        <img v-if="figure" :src="figure" alt="" loading="lazy"
            class="absolute left-[48%] top-[-58%] hidden h-[190%] w-auto max-w-none -translate-x-1/2 md:block" />
        <div v-if="accent" class="absolute inset-y-0 left-0 w-1" :style="{ backgroundColor: accent }" />

        <div class="relative flex flex-col gap-5 p-5 md:min-h-44 md:flex-row md:items-center md:justify-between">
            <div class="flex min-w-0 items-center gap-4">
                <slot name="identity" />
            </div>
            <div class="w-full md:w-96 md:shrink-0">
                <slot name="stats" />
            </div>
        </div>

        <div v-if="$slots.details" class="relative px-5 pb-4">
            <button type="button" class="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white"
                :aria-expanded="open" @click="open = !open">
                <UIcon :name="open ? 'i-ph-caret-up-fill' : 'i-ph-caret-down-fill'" class="h-3 w-3" />
                {{ open ? 'View Less' : 'View More' }}
            </button>
            <div v-if="open" class="mt-3">
                <slot name="details" />
            </div>
        </div>
    </article>
</template>
