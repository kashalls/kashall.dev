<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { data: posts } = await useAsyncData('blog-sidebar-posts', () =>
    queryCollection('blog')
        .where('draft', '=', false)
        .order('date', 'DESC')
        .select('title', 'path', 'tags')
        .all(),
)

// Group posts under each of their tags (a post with several tags appears in
// each group). Groups are sorted by tag; posts stay newest first.
const navigation = computed<ContentNavigationItem[]>(() => {
    const groups = new Map<string, ContentNavigationItem[]>()
    for (const post of posts.value ?? []) {
        for (const tag of post.tags.length ? post.tags : ['untagged']) {
            if (!groups.has(tag)) groups.set(tag, [])
            groups.get(tag)!.push({ title: post.title, path: post.path, icon: 'i-ph-file-text' })
        }
    }
    return [...groups.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        // Groups aren't pages; the path only needs to be a unique key.
        .map(([tag, children]) => ({ title: tagLabel(tag), path: `tag:${tag}`, icon: 'i-ph-hash', children }))
})

// Search groups results by navigation, so give it one flat group; the tag
// groups would list a multi-tag post once per tag.
const searchNavigation = computed<ContentNavigationItem[]>(() => [
    { title: 'Posts', path: '/blog', children: (posts.value ?? []).map(post => ({ title: post.title, path: post.path })) },
])

// Search index is only needed once the palette opens, so load it lazily.
const { data: searchFiles } = useLazyAsyncData('blog-search', () => queryCollectionSearchSections('blog'), { server: false })
</script>

<template>
    <!-- No site header bar here, so drop UPageAside's header offset and padding
         to line the sidebar up with the article. -->
    <UPageAside :ui="{ root: 'py-0 lg:top-0' }">
        <div class="flex flex-col gap-4">
            <UContentSearchButton :collapsed="false" :kbds="[]" label="Search" color="neutral" variant="ghost"
                class="-mx-2.5 text-muted" />
            <UContentNavigation :navigation="navigation" :collapsible="false" highlight highlight-color="primary"
                color="primary" variant="link" />
        </div>
        <ClientOnly>
            <UContentSearch :files="searchFiles ?? []" :navigation="searchNavigation" shortcut="meta_k" />
        </ClientOnly>
    </UPageAside>
</template>
