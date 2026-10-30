<script setup lang="ts">
// Shared game card for the Live column: the game's art behind identity, logo
// and stats, with a "View more" drawer for the details.
// backgroundPosition: an object-position class for the art; it's cropped to
// fill the card, so this picks which part survives.
withDefaults(defineProps<{ title: string; background?: string; backgroundPosition?: string }>(), {
    backgroundPosition: 'object-[center_25%]',
})
const open = ref(false)
</script>

<template>
    <article :aria-label="title" class="overflow-hidden rounded-lg border border-(--rule) font-stat">
        <!-- Art is scoped to this section so opening the drawer below doesn't
             rescale or re-crop it. -->
        <div class="relative">
            <NuxtImg v-if="background" :src="background" alt="" loading="lazy"
                :class="backgroundPosition" class="absolute inset-0 h-full w-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-black/70" />

            <div class="relative flex flex-col gap-4 p-5">
                <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div class="flex min-w-0 items-center gap-4">
                        <slot name="identity" />
                    </div>
                    <div class="w-24 shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        <slot name="logo" />
                    </div>
                </div>
                <slot name="stats" />
                <button v-if="$slots.details" type="button" :aria-expanded="open"
                    class="group flex items-center gap-1.5 self-start text-xs text-(--fg-2) hover:text-(--fg)"
                    @click="open = !open">
                    <UIcon name="i-ph-caret-down" class="size-3 transition-transform duration-300"
                        :class="open ? 'rotate-180 group-hover:-translate-y-0.5' : 'group-hover:translate-y-0.5'" />
                    {{ open ? 'View less' : 'View more' }}
                </button>
            </div>
        </div>

        <UCollapsible v-if="$slots.details" v-model:open="open">
            <template #content>
                <div class="px-5 pb-4 pt-3 transition-[opacity,translate] duration-300"
                    :class="open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'">
                    <slot name="details" />
                </div>
            </template>
        </UCollapsible>
    </article>
</template>
