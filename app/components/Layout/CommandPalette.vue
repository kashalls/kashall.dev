<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

const open = ref(false)
const colorMode = useColorMode()
const toast = useToast()
const { openContact } = useContact()
const { reduced, toggle: toggleMotion } = useMotionPreference()
const { enabled: readableFont, toggle: toggleReadableFont } = useReadableFont()
const { set: setTextSize } = useTextSize()
const { shortSha, ref: gitRef, commitUrl } = useBuildInfo()

defineShortcuts({
    meta_k: {
        usingInput: true,
        handler: () => {
            open.value = !open.value
        },
    },
})

const { data: posts, execute: loadPosts } = useLazyAsyncData('palette-posts', () =>
    queryCollection('blog')
        .where('draft', '=', false)
        .order('date', 'DESC')
        .select('title', 'description', 'path')
        .all(),
{ server: false, immediate: false })

watch(open, (isOpen) => {
    if (isOpen && !posts.value) loadPosts()
})

function barrelRoll() {
    const frame = document.getElementById('content-frame')
    if (!frame || reduced.value) return
    frame.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 1000, easing: 'ease-in-out' })
}

// Only appear when typed exactly, so they stay hidden from the default list.
const secrets: (CommandPaletteItem & { trigger: string })[] = [
    {
        trigger: 'sudo rm -rf /',
        label: 'sudo rm -rf /',
        icon: 'i-ph-skull',
        onSelect: () => toast.add({ title: 'Nice try.', description: 'This incident will be reported.', icon: 'i-ph-siren', color: 'error' }),
    },
    {
        trigger: 'kubectl get pods',
        label: 'kubectl get pods',
        icon: 'i-simple-icons-kubernetes',
        onSelect: () => toast.add({ title: 'ok8-sh-7c9f8b-x2k4l', description: '1/1 Running · 0 restarts (that you know of)', icon: 'i-simple-icons-kubernetes' }),
    },
    {
        trigger: 'do a barrel roll',
        label: 'do a barrel roll',
        icon: 'i-ph-arrows-clockwise',
        onSelect: barrelRoll,
    },
    {
        trigger: 'hire me',
        label: 'hire me',
        icon: 'i-ph-handshake',
        onSelect: () => openContact(),
    },
]

const groups = computed<CommandPaletteGroup[]>(() => [
    {
        id: 'pages',
        label: 'Pages',
        items: [
            { label: 'Home', icon: 'i-ph-house', to: '/' },
            { label: 'About', icon: 'i-ph-user', to: '/about' },
            { label: 'Work', icon: 'i-ph-briefcase', to: '/work' },
            { label: 'Writing', icon: 'i-ph-pen-nib', to: '/writing' },
            { label: 'Guestbook', icon: 'i-ph-book-open-text', to: '/guestbook' },
        ],
    },
    {
        id: 'posts',
        label: 'Posts',
        items: (posts.value ?? []).map(post => ({
            label: post.title,
            suffix: post.description,
            icon: 'i-ph-file-text',
            to: post.path,
        })),
    },
    {
        id: 'links',
        label: 'Links',
        items: [
            { label: 'Email me', icon: 'i-ph-envelope-simple', onSelect: () => openContact() },
            ...socials.map(social => ({ label: social.label, icon: social.icon, to: social.to, target: '_blank' })),
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        items: [
            { label: 'Dark theme', icon: 'i-ph-moon', onSelect: () => { colorMode.preference = 'dark' } },
            { label: 'Light theme', icon: 'i-ph-sun', onSelect: () => { colorMode.preference = 'light' } },
            { label: 'System theme', icon: 'i-ph-desktop', onSelect: () => { colorMode.preference = 'system' } },
            { label: reduced.value ? 'Allow motion' : 'Reduce motion', icon: 'i-ph-person-simple-walk', onSelect: toggleMotion },
            { label: readableFont.value ? 'Turn off OpenDyslexic font' : 'Use OpenDyslexic font', suffix: 'dyslexia', icon: 'i-ph-text-aa', onSelect: toggleReadableFont },
            ...TEXT_SIZES.map(option => ({ label: `${option.label} text`, suffix: 'text size', icon: 'i-ph-text-aa', onSelect: () => setTextSize(option.value) })),
        ],
    },
    {
        id: 'site',
        label: 'This site',
        items: [
            { label: 'View source', icon: 'i-ph-code', to: SOURCE_URL, target: '_blank' },
            ...(shortSha ? [{ label: `Deployed from ${shortSha}`, suffix: gitRef, icon: 'i-ph-git-commit', to: commitUrl, target: '_blank' }] : []),
        ],
    },
    {
        id: 'secrets',
        ignoreFilter: true,
        items: secrets,
        postFilter: (searchTerm, items) => items.filter(item => item.trigger === searchTerm.trim().toLowerCase()),
    },
])
</script>

<template>
    <UTooltip text="Search" :kbds="['meta', 'K']">
        <UButton icon="i-ph-magnifying-glass" color="neutral" variant="ghost" aria-label="Search"
            class="text-muted hover:text-highlighted"
            @click="open = true" />
    </UTooltip>

    <UModal v-model:open="open" :ui="{ content: 'sm:max-w-xl' }">
        <template #content>
            <UCommandPalette :groups="groups" placeholder="Jump to a page, post, link or setting…" close
                class="h-96" @update:model-value="open = false" @update:open="open = $event" />
        </template>
    </UModal>
</template>
