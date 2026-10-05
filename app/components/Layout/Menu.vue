<script setup lang="ts">
const colorMode = useColorMode()
const { openContact } = useContact()
const { reduced, toggle: toggleMotion } = useMotionPreference()

const socials = [
    { label: 'GitHub', icon: 'i-ph-github-logo', to: 'https://github.com/kashalls' },
    { label: 'LinkedIn', icon: 'i-ph-linkedin-logo', to: 'https://www.linkedin.com/in/jordpjones/' },
    { label: 'Twitter / X', icon: 'i-ph-twitter-logo', to: 'https://twitter.com/jordpjones' },
    { label: 'Discord', icon: 'i-ph-discord-logo', to: 'https://discordapp.com/users/201077739589992448' },
]

const linksItems = computed(() => [
    socials.map(s => ({ label: s.label, icon: s.icon, to: s.to, target: '_blank' })),
    [{ label: 'Email me', icon: 'i-ph-envelope-simple', onSelect: () => openContact() }],
])

const themes = [
    { label: 'Dark', icon: 'i-ph-moon', value: 'dark' },
    { label: 'Light', icon: 'i-ph-sun', value: 'light' },
    { label: 'System', icon: 'i-ph-desktop', value: 'system' },
]

const settingsItems = computed(() => [
    themes.map(t => ({
        label: t.label,
        icon: t.icon,
        trailingIcon: colorMode.preference === t.value ? 'i-ph-check' : undefined,
        onSelect: (e: Event) => { e.preventDefault(); colorMode.preference = t.value },
    })),
    [{
        label: 'Reduce motion',
        icon: 'i-ph-person-simple-walk',
        trailingIcon: reduced.value ? 'i-ph-check' : undefined,
        onSelect: (e: Event) => { e.preventDefault(); toggleMotion() },
    }],
])

const triggerClass = 'text-muted hover:text-highlighted data-[state=open]:text-highlighted'
</script>

<template>
    <nav class="hidden items-center sm:flex">
        <UButton to="/blog" label="Blog" color="neutral" variant="ghost" size="xs" :class="triggerClass" />

        <UDropdownMenu :items="linksItems" :content="{ align: 'start' }" :ui="{ content: 'w-48' }">
            <UButton label="Links" color="neutral" variant="ghost" size="xs" :class="triggerClass" />
        </UDropdownMenu>

        <UDropdownMenu :items="settingsItems" :content="{ align: 'start' }" :ui="{ content: 'w-44' }">
            <UButton label="Settings" color="neutral" variant="ghost" size="xs" :class="triggerClass" />
        </UDropdownMenu>
    </nav>
</template>
