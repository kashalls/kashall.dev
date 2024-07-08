<template>
    <div ref="panel"
        class="flex flex-col border border-gray-900 h-full rounded overflow-hidden bg-gradient-to-tr from-[#0e0c12]/75 to-[#0e0f0f]/25 backdrop-blur-3xl">
        <div class="flex min-h-10 h-10 items-center gap-4 border-b border-gray-900 text-neutral">
            <p class="font-body text-sm font-normal tracking-normal text-neutral-50 px-4">
                {{ props.title }}
            </p>
            <div class="flex ml-auto gap-2">
                <UButton icon="i-ph-line-vertical" size="2xs" color="purple" square variant="ghost" padded
                    class="rotate-90" />
                <UButton icon="i-ph-square" size="2xs" color="purple" square variant="ghost" padded />
                <UButton icon="i-ph-x" size="2xs" color="purple" square variant="ghost" padded />
            </div>
        </div>
        <div :class="cn(props.padded ? 'p-4' : '')">
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
    buttons: {
        type: Boolean,
        default: true
    },
    padded: {
        type: Boolean,
        default: true
    }
})
</script>
