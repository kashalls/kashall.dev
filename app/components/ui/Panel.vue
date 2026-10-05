<template>
    <div
        class="glow-card flex h-full flex-col overflow-hidden rounded border border-gray-900 bg-gradient-to-tr from-[#0e0c12]/75 to-[#0e0f0f]/25 backdrop-blur-3xl">
        <div class="flex h-10 min-h-10 shrink-0 cursor-default select-none items-center border-b border-gray-900">
            <p class="flex items-center gap-2 truncate px-4 font-body text-sm font-normal tracking-normal text-neutral-50">
                <UIcon v-if="props.icon" :name="props.icon" class="h-4 w-4 shrink-0 text-primary-400" />
                {{ props.title }}
            </p>
        </div>
        <div class="flex flex-1 flex-col" :class="props.padded && 'p-4'">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: undefined
    },
    padded: {
        type: Boolean,
        default: true
    }
})
</script>
