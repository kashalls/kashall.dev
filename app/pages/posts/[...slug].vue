<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).where('draft', '=', false).first(),
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { surround } = await useBlogNavigation()
const section = computed(() => blogSection(post.value?.section))

useSeoMeta({
    title: `${post.value.title} — Jordan Jones`,
    description: post.value.description,
    ogDescription: post.value.description,
    ogType: 'article',
    articlePublishedTime: new Date(post.value.date).toISOString(),
    articleModifiedTime: post.value.updated && new Date(post.value.updated).toISOString(),
    articleTag: post.value.tags,
})
const date = computed(() => formatDate(postDate(post.value!.date)))
const updated = computed(() => post.value?.updated && formatDate(postDate(post.value.updated)))
const editUrl = computed(() => `${SOURCE_URL}/edit/main/content/${post.value!.stem}.${post.value!.extension}`)

defineOgImage('Post', {
    title: post.value.title,
    description: post.value.description,
    date: date.value,
    tags: post.value.tags,
})

// Back to wherever on the site the reader came from; arriving from outside
// (a shared link), the link's own target, Writing, is the way back.
const router = useRouter()
function back(event: MouseEvent) {
    if (!window.history.state?.back) return
    event.preventDefault()
    router.back()
}

const tags = computed(() => post.value?.tags ?? [])
const [previous, next] = [computed(() => surround.value[0]), computed(() => surround.value[1])]

// Headings two and three deep, flattened for the "On this page" list.
const toc = computed(() => (post.value?.body?.toc?.links ?? []).flatMap(link => [link, ...(link.children ?? [])]))

// The heading being read: the last one scrolled past the top of the column.
const column = useTemplateRef<HTMLElement>('column')
const reading = ref<string>()
function track() {
    const top = column.value!.getBoundingClientRect().top + 120
    reading.value = toc.value.findLast(link => (document.getElementById(link.id)?.getBoundingClientRect().top ?? Infinity) <= top)?.id
}
useEventListener(column, 'scroll', track, { passive: true })
</script>

<template>
    <main v-if="post" ref="column" class="column column-wide">
        <header class="mb-10">
            <NuxtLink to="/writing" class="back mb-8" @click="back">
                <UIcon name="i-ph-arrow-left" class="size-4" />
                Back
            </NuxtLink>
            <p class="flex flex-wrap items-center gap-x-2 text-sm">
                <NuxtLink to="/writing" :class="section?.accent.text" class="hover:underline">{{ section?.label }}</NuxtLink>
                <template v-if="tagLabel(post.category) !== section?.label">
                    <span class="text-(--fg-3)" aria-hidden="true">/</span>
                    <span class="text-(--fg-3)">{{ tagLabel(post.category) }}</span>
                </template>
            </p>
            <h1 class="doc-title mt-3">{{ post.title }}</h1>
            <p v-if="post.description" class="lead mt-4">{{ post.description }}</p>
            <p class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--fg-3)">
                <time :datetime="new Date(post.date).toISOString()">{{ date }}</time>
                <time v-if="updated" :datetime="new Date(post.updated!).toISOString()">Updated {{ updated }}</time>
                <NuxtLink v-for="tag in tags" :key="tag" :to="{ path: '/posts', query: { q: tag } }"
                    class="hover:underline" :class="section?.accent.text">#{{ tag }}</NuxtLink>
            </p>
        </header>

        <ContentRenderer :value="post" class="prose-field" />

        <footer class="mt-14 flex flex-col gap-10">
            <a :href="editUrl" target="_blank" rel="noopener" class="self-start text-sm text-(--fg-3) hover:text-(--fg)">Edit this page on GitHub</a>

            <nav v-if="previous || next" aria-label="More in this section" class="grid gap-4 border-t border-(--rule) pt-8 sm:grid-cols-2">
                <NuxtLink v-if="previous" :to="previous.path" class="neighbour">
                    <span class="text-xs text-(--fg-3)">Previous</span>
                    <span class="neighbour-title">{{ previous.title }}</span>
                </NuxtLink>
                <NuxtLink v-if="next" :to="next.path" class="neighbour sm:col-start-2 sm:text-right">
                    <span class="text-xs text-(--fg-3)">Next</span>
                    <span class="neighbour-title">{{ next.title }}</span>
                </NuxtLink>
            </nav>

            <!-- Docs and guides change in place, so only the Blog section takes comments. -->
            <BlogComments v-if="post.section === 'blog'" :path="post.path" class="border-t border-(--rule) pt-8" />
        </footer>

        <nav v-if="toc.length" aria-label="On this page" class="toc">
            <p class="mb-3 text-xs text-(--fg-3)">On this page</p>
            <ul class="flex flex-col gap-1.5">
                <li v-for="link in toc" :key="link.id" :class="link.depth > 2 && 'pl-3'">
                    <a :href="`#${link.id}`" class="toc-link" :aria-current="reading === link.id ? 'location' : undefined">{{ link.text }}</a>
                </li>
            </ul>
        </nav>
    </main>
</template>

<style scoped>
.back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--fg-3);
    transition: color 200ms, gap 200ms;
}

.back:hover,
.back:focus-visible {
    gap: 0.6rem;
    color: var(--fg);
}

.neighbour {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.neighbour-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--fg);
    transition: color 200ms;
}

.neighbour:hover .neighbour-title,
.neighbour:focus-visible .neighbour-title {
    color: var(--accent);
}

/* Bottom right over the field, below the particle title, where there's room. */
.toc {
    display: none;
}

@media (min-width: 1280px) and (min-aspect-ratio: 1/1) {
    .toc {
        position: fixed;
        right: clamp(1.25rem, 4vw, 3.5rem);
        bottom: calc(clamp(1.5rem, 5vh, 3rem) + var(--notice-room, 0px));
        display: block;
        width: 15rem;
        max-height: 26vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--rule) transparent;
    }
}

.toc-link {
    display: block;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--fg-3);
    transition: color 200ms;
}

.toc-link:hover,
.toc-link[aria-current] {
    color: var(--fg);
}

.toc-link[aria-current]::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    margin: 0 0.5rem 0.15rem -0.85rem;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px 1px var(--accent);
}
</style>
