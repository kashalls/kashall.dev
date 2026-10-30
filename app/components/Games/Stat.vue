<script setup lang="ts">
defineProps<{ label: string; value?: string | number; color?: string; valueClass?: string }>()
</script>

<template>
    <div class="min-w-0 rounded border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
        <p class="truncate text-xs text-neutral-400">{{ label }}</p>
        <p :class="['truncate text-lg font-bold leading-tight tabular-nums text-white', valueClass]"
            :style="color ? { color } : undefined">
            {{ value ?? '—' }}
        </p>
    </div>
</template>
