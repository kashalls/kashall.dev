<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

// /posts is only a search results page; without a query it opens the first post.
if (!('q' in route.query)) {
    await navigateTo('/posts/introduction', { redirectCode: 302 })
}

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const debouncedQuery = refDebounced(query, 200)
watch(debouncedQuery, q => router.replace({ query: { q } }))

const { data: sections } = await useAsyncData('blog-search-sections', () =>
    queryCollectionSearchSections('blog', { extraFields: ['tags'] }).where('draft', '=', false),
)

const terms = computed(() => debouncedQuery.value.toLowerCase().split(/\s+/).filter(Boolean))

// A section matches when every term appears in its titles or text. Tags count
// only for a post's top-level entry, so a tag doesn't match every heading.
const results = computed(() => {
    if (!terms.value.length) return []
    return (sections.value ?? [])
        .filter(section => {
            const text = [section.title, ...section.titles, section.content, ...(section.level === 1 ? section.tags ?? [] : [])].join(' ').toLowerCase()
            return terms.value.every(term => text.includes(term))
        })
        .map(section => ({ ...section, snippet: snippet(section.content) }))
})

// Up to ~160 characters of text, starting a little before the first term found.
function snippet(content: string) {
    const lower = content.toLowerCase()
    const hit = terms.value.map(term => lower.indexOf(term)).find(i => i >= 0) ?? 0
    const start = Math.max(0, hit - 40)
    const text = content.slice(start, start + 160).trim()
    return (start > 0 ? '…' : '') + text + (start + 160 < content.length ? '…' : '')
}

useSeoMeta({
    title: () => debouncedQuery.value ? `Search: ${debouncedQuery.value} — Jordan Jones` : 'Search — Jordan Jones',
    robots: 'noindex',
})
</script>

<template>
    <UiContainer>
        <!-- Fixed side columns, sized like the Mintlify docs. -->
        <UPage :ui="{ root: 'lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-12', left: 'lg:col-span-1', center: 'lg:col-span-1' }">
            <template #left>
                <BlogSidebar />
            </template>

            <UPageHeader title="Search" description="Search every post."
                :ui="{ root: 'pt-0', title: 'font-display' }">
                <template #links>
                    <UButton to="/feed.xml" external target="_blank" icon="i-ph-rss" label="RSS" color="neutral"
                        variant="outline" size="sm" />
                </template>
                <UInput v-model="query" icon="i-ph-magnifying-glass" placeholder="Search posts…" size="lg"
                    autofocus class="mt-6 w-full" :ui="{ base: 'rounded-md' }" />
            </UPageHeader>

            <UPageBody>
                <ul v-if="results.length" class="flex flex-col divide-y divide-default">
                    <li v-for="result in results" :key="result.id" class="py-5 first:pt-0">
                        <NuxtLink :to="result.id" class="group flex flex-col gap-1.5">
                            <span v-if="result.titles.length" class="text-sm font-semibold text-primary">
                                {{ result.titles.join(' › ') }}
                            </span>
                            <p class="text-lg font-semibold text-highlighted group-hover:text-primary">{{ result.title }}</p>
                            <p v-if="result.snippet" class="text-muted">{{ result.snippet }}</p>
                        </NuxtLink>
                    </li>
                </ul>
                <UEmpty v-else-if="terms.length" icon="i-ph-magnifying-glass" title="No results"
                    :description="`Nothing matches “${debouncedQuery}”.`" variant="naked" />
            </UPageBody>
        </UPage>
    </UiContainer>
</template>
