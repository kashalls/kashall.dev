<script setup lang="ts">
// Shared wide card shell for /games, laid out like the Battle.net launcher:
// identity plus stats in a column on the left with "View More" under them,
// and the game logo floating on the art at the right.
defineProps<{ background?: string; accent?: string }>()
const open = ref(false)
</script>

<template>
    <article
        class="relative overflow-hidden rounded-lg border border-gray-900 bg-[#0e0c12] font-stat transition-[border-color,box-shadow] duration-300 hover:border-primary-800/50 hover:shadow-lg hover:shadow-primary-950/40">
        <!-- Art is scoped to this section so opening the drawer below doesn't
             rescale or re-crop it. -->
        <div class="relative">
            <img v-if="background" :src="background" alt="" loading="lazy"
                class="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-black/70" />

            <div
                class="relative flex flex-col gap-5 p-5 md:min-h-52 md:flex-row-reverse md:items-center md:justify-between">
                <div class="flex shrink-0 justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:w-36 md:justify-end md:self-start">
                    <slot name="logo" />
                </div>
                <div class="flex w-full flex-col gap-4 md:w-[26rem] md:shrink-0">
                    <div class="flex min-w-0 items-center gap-4">
                        <slot name="identity" />
                    </div>
                    <slot name="stats" />
                </div>
            </div>

            <div v-if="$slots.details" class="relative flex px-5 pb-4">
                <UButton :label="open ? 'View Less' : 'View More'" leading-icon="i-ph-caret-down-fill"
                    color="neutral" variant="link" size="xs" :aria-expanded="open"
                    class="group p-0 text-neutral-300 hover:text-white"
                    :ui="{ leadingIcon: ['size-3 transition-transform duration-300 group-hover:translate-y-0.5', open && 'rotate-180 group-hover:-translate-y-0.5'] }"
                    @click="open = !open" />
            </div>
        </div>

        <UCollapsible v-if="$slots.details" v-model:open="open">
            <template #content>
                <div class="relative px-5 pb-4 pt-3 transition-[opacity,translate] duration-300"
                    :class="open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'">
                    <slot name="details" />
                </div>
            </template>
        </UCollapsible>

        <div v-if="accent" class="absolute inset-y-0 left-0 w-1" :style="{ backgroundColor: accent }" />
    </article>
</template>
