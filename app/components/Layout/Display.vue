<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const colorMode = useColorMode()
const { size, set: setSize } = useTextSize()
const { reduced, set: setReduced } = useMotionPreference()
const { enabled: readableFont, set: setReadableFont } = useReadableFont()

const themes = [
    { label: 'System', icon: 'i-ph-desktop', value: 'system' },
    { label: 'Light', icon: 'i-ph-sun', value: 'light' },
    { label: 'Dark', icon: 'i-ph-moon', value: 'dark' },
]

const currentTheme = computed(() => themes.find(theme => theme.value === colorMode.preference) ?? themes[0]!)

const items = computed(() => [
    [
        {
            label: 'Text size',
            icon: 'i-ph-text-aa',
            slot: 'setting',
            value: TEXT_SIZES.find(option => option.value === size.value)?.label,
            children: TEXT_SIZES.map(option => ({
                label: option.label,
                type: 'checkbox' as const,
                checked: size.value === option.value,
                onUpdateChecked: () => setSize(option.value),
            })),
        },
        {
            label: 'Font',
            icon: 'i-ph-text-t',
            slot: 'setting',
            value: readableFont.value ? 'OpenDyslexic' : 'Inter',
            children: [
                { label: 'Inter', type: 'checkbox' as const, checked: !readableFont.value, onUpdateChecked: () => setReadableFont(false) },
                {
                    label: 'OpenDyslexic',
                    description: 'Designed for readers with dyslexia',
                    type: 'checkbox' as const,
                    checked: readableFont.value,
                    onUpdateChecked: () => setReadableFont(true),
                },
            ],
        },
        {
            label: 'Motion',
            icon: 'i-ph-wave-sine',
            slot: 'setting',
            value: reduced.value ? 'Reduced' : 'Full',
            children: [
                { label: 'Full', type: 'checkbox' as const, checked: !reduced.value, onUpdateChecked: () => setReduced(false) },
                { label: 'Reduced', type: 'checkbox' as const, checked: reduced.value, onUpdateChecked: () => setReduced(true) },
            ],
        },
    ],
    [
        {
            label: currentTheme.value.label,
            icon: currentTheme.value.icon,
            slot: 'theme',
            // The row stays open and cycles modes so keyboard users can reach
            // what the inline buttons do with a pointer.
            onSelect: (e: Event) => {
                e.preventDefault()
                const next = themes[(themes.indexOf(currentTheme.value) + 1) % themes.length]!
                colorMode.preference = next.value
            },
        },
    ],
] satisfies DropdownMenuItem[][])
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'end' }" :ui="{ content: 'w-60' }">
        <UButton icon="i-ph-palette" aria-label="Display settings" color="neutral" variant="ghost"
            class="text-muted hover:text-highlighted data-[state=open]:text-highlighted" />

        <template #setting-trailing="{ item, ui }">
            <span class="text-sm text-primary">{{ item.value }}</span>
            <UIcon :name="appConfig.ui.icons.chevronRight" :class="ui.itemTrailingIcon()" />
        </template>

        <template #theme-trailing>
            <div class="flex items-center gap-0.5 rounded-md bg-elevated p-0.5">
                <UButton v-for="theme in themes" :key="theme.value" :icon="theme.icon" :aria-label="theme.label"
                    :aria-pressed="colorMode.preference === theme.value" tabindex="-1" size="xs"
                    :color="colorMode.preference === theme.value ? 'primary' : 'neutral'"
                    :variant="colorMode.preference === theme.value ? 'soft' : 'ghost'"
                    @click.stop="colorMode.preference = theme.value" />
            </div>
        </template>
    </UDropdownMenu>
</template>
