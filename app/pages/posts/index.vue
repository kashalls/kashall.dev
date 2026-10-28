<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

const route = useRoute()
const router = useRouter()

// /posts is only a search results page; without a query it goes to the index.
if (!('q' in route.query)) {
    await navigateTo('/writing', { redirectCode: 302 })
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
    <main class="column">
        <h1 class="page-name">Search</h1>
        <input v-model="query" type="search" placeholder="Search every post" aria-label="Search posts" autofocus
            class="search-input">
        <ul v-if="results.length" class="list mt-8">
            <li v-for="result in results" :key="result.id">
                <NuxtLink :to="result.id" class="item">
                    <span v-if="result.titles.length" class="item-meta text-(--accent)">{{ result.titles.join(' / ') }}</span>
                    <span class="item-title">{{ result.title }}</span>
                    <span v-if="result.snippet" class="item-text">{{ result.snippet }}</span>
                </NuxtLink>
            </li>
        </ul>
        <p v-else-if="terms.length" class="item-text mt-8">Nothing matches “{{ debouncedQuery }}”. Try fewer words, or browse <NuxtLink to="/writing" class="inline-link">everything I've written</NuxtLink>.</p>
    </main>
</template>
