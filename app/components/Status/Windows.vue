<script setup lang="ts">
defineProps<{
    code: string | number
    title: string
    description: string
}>()
</script>

<template>
    <section class="flex min-h-full items-center justify-center p-4 select-none">
        <div class="flex w-full max-w-3xl flex-col gap-4 lg:flex-row lg:items-start">
            <!-- Status code "image" -->
            <div class="w-full lg:w-2/5">
                <UiPanel :title="String(code)" icon="i-ph-warning-octagon" :dock="false" :padded="false">
                    <div
                        class="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900/30 via-black to-black">
                        <div
                            class="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_120%,rgb(var(--color-primary-500)),transparent_60%)]" />
                        <span
                            class="relative select-none bg-gradient-to-br from-primary-200 to-primary-600 bg-clip-text text-7xl font-black tracking-tighter text-transparent sm:text-8xl">
                            {{ code }}
                        </span>
                    </div>
                </UiPanel>
            </div>

            <!-- Related content -->
            <div class="w-full lg:flex-1">
                <UiPanel :title="title" icon="i-ph-info" :dock="false">
                    <div class="flex h-full flex-col gap-4 p-1">
                        <p class="text-slate-300">{{ description }}</p>
                        <slot name="extra" />
                        <div class="mt-auto flex flex-wrap gap-2 pt-2">
                            <slot>
                                <UButton to="/" icon="i-ph-house" color="primary">Go home</UButton>
                            </slot>
                        </div>
                    </div>
                </UiPanel>
            </div>
        </div>
    </section>
</template>
