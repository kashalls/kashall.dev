<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { sections } = await useBlogNavigation()

// Search groups its results by these top-level entries.
const searchNavigation = computed<ContentNavigationItem[]>(() => sections.value.map(section => ({
    title: section.label,
    path: `section:${section.id}`,
    children: section.categories.flatMap(category => category.posts.map(post => ({ title: post.title, path: post.path }))),
})))

// Hands the typed query to the full results page.
const searchTerm = ref('')
const searchGroups = computed(() => searchTerm.value.trim()
    ? [{
        id: 'all-results',
        ignoreFilter: true,
        items: [{ label: `See all results for “${searchTerm.value.trim()}”`, icon: 'i-ph-list-magnifying-glass', to: { path: '/posts', query: { q: searchTerm.value.trim() } } }],
    }]
    : [])

// Search index is only needed once the palette opens, so load it lazily.
const { data: searchFiles } = useLazyAsyncData('blog-search', () => queryCollectionSearchSections('blog').where('draft', '=', false), { server: false })
</script>

<template>
    <!-- No site header bar here, so drop UPageAside's header offset and padding
         to line the sidebar up with the article. The container takes UiPanel's
         glass surface; the root can't, as glow-card would unstick it. -->
    <UPageAside :ui="{
        root: 'py-0 lg:top-0',
        container: 'glow-card rounded-lg border border-default bg-gradient-to-tr from-white/75 to-white/25 dark:from-[#0e0c12]/75 dark:to-[#0e0f0f]/25 backdrop-blur-3xl p-2 pb-4',
    }">
        <BlogNav />
        <ClientOnly>
            <UContentSearch v-model:search-term="searchTerm" :files="searchFiles ?? []" :navigation="searchNavigation"
                :groups="searchGroups" shortcut="meta_k" />
        </ClientOnly>
    </UPageAside>
</template>
