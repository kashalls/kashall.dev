<script setup lang="ts">
const { reset } = useResetLayout()
const spinning = ref(false)

function handle() {
    reset()
    spinning.value = true
    setTimeout(() => (spinning.value = false), 500)
}
</script>

<template>
    <UTooltip text="Reset window layout">
        <UButton color="neutral" variant="ghost" aria-label="Reset window layout" @click="handle">
            <UIcon name="i-ph-arrow-clockwise" class="h-5 w-5" :class="spinning && 'animate-[spin_0.5s_ease]'" />
        </UButton>
    </UTooltip>
</template>
