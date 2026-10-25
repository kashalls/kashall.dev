<script setup lang="ts">
const open = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
    open.value = false
})

const links = [
    { label: 'Home', icon: 'i-ph-house', to: '/' },
    { label: 'Posts', icon: 'i-ph-article', to: '/posts' },
]
</script>

<template>
    <!-- Below lg the posts sidebar is hidden, so its navigation lives here too. -->
    <USlideover v-model:open="open" title="Menu" :ui="{ content: 'max-w-xs' }">
        <UButton icon="i-ph-list" color="neutral" variant="ghost" aria-label="Open menu"
            class="text-muted hover:text-highlighted" />

        <template #body>
            <nav class="flex flex-col gap-px text-sm">
                <NuxtLink v-for="link in links" :key="link.to" :to="link.to"
                    class="flex items-center gap-2.5 rounded-md py-1.5 pr-3 pl-4 font-medium text-muted transition-colors hover:bg-elevated/50 hover:text-highlighted"
                    :class="(link.to === '/' ? route.path === '/' : route.path.startsWith(link.to)) && '!bg-primary/10 !text-primary'">
                    <UIcon :name="link.icon" class="size-4 shrink-0" />
                    {{ link.label }}
                </NuxtLink>
            </nav>
            <template v-if="route.path.startsWith('/posts')">
                <USeparator class="my-6" />
                <BlogNav />
            </template>
            <USeparator class="my-6" />
            <LayoutSocial />
        </template>
    </USlideover>
</template>
