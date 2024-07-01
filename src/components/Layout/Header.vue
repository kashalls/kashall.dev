<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>

<template>
    <div
        class="grid-cols-3 items-center gap-4 border-b border-gray-900 grid bg-gradient-to-tr from-[#0e0c12]/25 to-[#0e0f0f]/25 pr-1 [grid-area:header]">
        <div class="col-start-1 items-center justify-center pl-1 pr-1.5">
            <UButton to="/" class="transition hover:text-primary-200" variant="ghost" color="purple">
                <Logo class="h-5 w-5" />
            </UButton>
        </div>

        <div class="flex gap-2 text-gray-700 col-start-3 justify-self-end">
            <UButton icon="i-ph-line-vertical" size="xs" color="purple" square variant="ghost" padded
                class="rotate-90" />
            <UButton icon="i-ph-square" size="xs" color="purple" square variant="ghost" padded />
            <UButton icon="i-ph-x" size="xs" color="purple" square variant="ghost" padded />
        </div>

        <div
            :class="cn('col-start-3 items-center justify-self-end text-neutral hidden', mobileMenuOpen && 'open')">
            <UButton aria-label="Main Menu" variant="ghost"
                :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3-20-solid'"
                :ui="{ icon: { base: cn(mobileMenuOpen && 'open') } }" @click="mobileMenuOpen = !mobileMenuOpen" />
        </div>
    </div>
</template>

<style scoped>
button span,
button span *{
    transform-origin: center;
    transition-duration: .5s;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(.615, .19, .305, .91)
}

.open .top {
    transform: translate(4px, 4px) rotate(-45deg)
}

.open .center {
    opacity: 0;
    transform: translate(100%)
}

.open .bottom {
    transform: translate(4px, -4px) rotate(45deg)
}
</style>