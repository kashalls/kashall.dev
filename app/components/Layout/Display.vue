<script setup lang="ts">
const colorMode = useColorMode()
const { size, set: setSize } = useTextSize()
const { reduced, set: setReduced } = useMotionPreference()
const { enabled: readableFont, set: setReadableFont } = useReadableFont()

const themes = [
    { label: 'Dark', icon: 'i-ph-moon', value: 'dark' },
    { label: 'Light', icon: 'i-ph-sun', value: 'light' },
    { label: 'System', icon: 'i-ph-desktop', value: 'system' },
]
</script>

<template>
    <UPopover :content="{ side: 'top', align: 'start', sideOffset: 8 }">
        <UButton icon="i-ph-text-aa" label="Display" color="neutral" variant="ghost"
            class="text-muted hover:text-highlighted data-[state=open]:text-highlighted" :ui="{ label: 'hidden md:inline' }" />

        <template #content>
            <div class="flex w-72 flex-col gap-5 p-4">
                <fieldset class="flex flex-col gap-2">
                    <legend class="mb-2 text-sm font-semibold text-highlighted">Theme</legend>
                    <ClientOnly>
                        <div class="grid grid-cols-3 gap-1.5">
                            <UButton v-for="theme in themes" :key="theme.value" :icon="theme.icon" :label="theme.label"
                                :aria-pressed="colorMode.preference === theme.value"
                                :color="colorMode.preference === theme.value ? 'primary' : 'neutral'"
                                :variant="colorMode.preference === theme.value ? 'soft' : 'outline'"
                                class="flex-col gap-1 py-2" :ui="{ label: 'text-xs' }" block
                                @click="colorMode.preference = theme.value" />
                        </div>
                    </ClientOnly>
                </fieldset>

                <fieldset class="flex flex-col gap-2">
                    <legend class="mb-2 text-sm font-semibold text-highlighted">Text size</legend>
                    <div class="grid grid-cols-4 gap-1.5">
                        <UButton v-for="(option, i) in TEXT_SIZES" :key="option.value" :aria-label="option.label"
                            :title="option.label" :aria-pressed="size === option.value"
                            :color="size === option.value ? 'primary' : 'neutral'"
                            :variant="size === option.value ? 'soft' : 'outline'" class="justify-center py-2" block
                            @click="setSize(option.value)">
                            <span class="font-semibold leading-none" :style="{ fontSize: `${0.75 + i * 0.1875}rem` }">A</span>
                        </UButton>
                    </div>
                </fieldset>

                <div class="flex flex-col gap-3">
                    <USwitch :model-value="reduced" label="Reduce motion" @update:model-value="setReduced" />
                    <USwitch :model-value="readableFont" label="OpenDyslexic font"
                        description="A typeface designed for readers with dyslexia." @update:model-value="setReadableFont" />
                </div>
            </div>
        </template>
    </UPopover>
</template>
