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
         to line the sidebar up with the article. -->
    <UPageAside :ui="{ root: 'py-0 lg:top-0' }">
        <BlogNav />
        <ClientOnly>
            <UContentSearch v-model:search-term="searchTerm" :files="searchFiles ?? []" :navigation="searchNavigation"
                :groups="searchGroups" shortcut="meta_k" />
        </ClientOnly>
    </UPageAside>
</template>
