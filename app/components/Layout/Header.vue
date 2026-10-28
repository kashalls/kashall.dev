<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { sections } = await useBlogNavigation()

const items = computed<NavigationMenuItem[]>(() =>
    sections.value.map(section => ({ label: section.label, icon: section.icon, to: section.first, accent: section.accent })))

const menuLinks = computed<NavigationMenuItem[]>(() => [
    { label: 'Home', icon: 'i-ph-house', to: '/', active: route.path === '/' },
    { label: 'Writing', icon: 'i-ph-pen-nib', to: '/writing' },
])
</script>

<template>
    <!-- Sized by the layout's grid row rather than UHeader's own height and
         stickiness. -->
    <UHeader title="Jordan Jones" mode="slideover" :menu="{ title: 'Menu' }" :ui="{
        root: 'static z-auto h-auto bg-transparent backdrop-blur-none bg-gradient-to-tr from-white/25 to-white/25 dark:from-[#0e0c12]/25 dark:to-[#0e0f0f]/25 [grid-area:header]',
        container: 'max-w-[96rem] px-2 sm:px-2 md:px-4 lg:px-4',
        title: 'items-center gap-2.5 rounded-md px-2.5 py-1.5 text-base font-semibold transition hover:text-primary',
        right: 'gap-1',
        content: 'max-w-xs sm:max-w-xs',
    }">
        <template #title>
            <Logo class="size-6" />
            <span class="hidden font-display sm:inline">Jordan Jones</span>
        </template>

        <UNavigationMenu :items="items" color="neutral" variant="link">
            <template #item-leading="{ item }">
                <span v-if="item.accent" class="flex size-6 items-center justify-center rounded-md ring-1"
                    :class="[item.accent.text, item.accent.ring]">
                    <UIcon :name="item.icon" class="size-4" />
                </span>
            </template>
        </UNavigationMenu>

        <template #right>
            <LayoutCommandPalette />
            <!-- No room below lg; the menu carries them there. -->
            <LayoutDisplay />
            <LayoutSocial class="hidden lg:flex" />
        </template>

        <template #body>
            <UNavigationMenu :items="menuLinks" orientation="vertical" color="primary" />
            <USeparator class="my-6" />
            <UNavigationMenu :items="items" orientation="vertical" color="neutral">
                <template #item-leading="{ item }">
                    <span class="flex size-6 items-center justify-center rounded-md ring-1"
                        :class="[item.accent.text, item.accent.ring]">
                        <UIcon :name="item.icon" class="size-4" />
                    </span>
                </template>
            </UNavigationMenu>
            <USeparator class="my-6" />
            <LayoutSocial />
        </template>
    </UHeader>
</template>
