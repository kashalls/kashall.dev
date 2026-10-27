<script setup lang="ts">
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

const tags = computed(() => post.value?.tags ?? [])
const toc = computed(() => post.value?.body?.toc?.links ?? [])
</script>

<template>
    <UiContainer v-if="post">
        <!-- Fixed side columns, sized like the Mintlify docs, which also drop the
             table of contents below xl to leave the article room. The article is
             capped for comfortable line lengths on wide screens. -->
        <UPage :ui="{
            root: 'lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_16.5rem] lg:gap-x-12',
            left: 'lg:col-span-1',
            center: 'lg:col-span-1 w-full max-w-[45rem] justify-self-center',
            right: 'lg:col-span-1 lg:hidden xl:block',
        }">
            <template #left>
                <BlogSidebar />
            </template>

            <UPageHeader :title="post.title" :description="post.description" :ui="{ root: 'pt-0', title: 'font-display' }">
                <template #headline>
                    <span class="flex items-center gap-1.5" :class="section?.accent.text">
                        <UIcon v-if="section" :name="section.icon" class="size-4" />
                        {{ section?.label }}
                        <template v-if="tagLabel(post.category) !== section?.label">
                            <UIcon name="i-ph-caret-right" class="size-3 text-dimmed" />
                            {{ tagLabel(post.category) }}
                        </template>
                    </span>
                </template>
                <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
                    <time :datetime="new Date(post.date).toISOString()">{{ date }}</time>
                    <template v-if="updated">
                        <span class="text-dimmed">·</span>
                        <time :datetime="new Date(post.updated!).toISOString()">Updated {{ updated }}</time>
                    </template>
                    <span v-if="tags.length" class="text-dimmed">·</span>
                    <NuxtLink v-for="tag in tags" :key="tag" :to="{ path: '/posts', query: { q: tag } }"
                        class="hover:text-highlighted" :class="section?.accent.text">#{{ tag }}</NuxtLink>
                </div>
            </UPageHeader>

            <UPageBody>
                <ContentRenderer :value="post" />

                <UButton :to="editUrl" target="_blank" icon="i-ph-pencil-simple" label="Edit this page on GitHub"
                    color="neutral" variant="link" class="px-0 text-muted hover:text-highlighted" />

                <template v-if="surround.some(Boolean)">
                    <USeparator />
                    <UContentSurround :surround="surround" />
                </template>

                <!-- Docs and guides change in place, so only the Blog section takes comments. -->
                <template v-if="post.section === 'blog'">
                    <USeparator />
                    <BlogComments :path="post.path" />
                </template>
            </UPageBody>

            <!-- Always reserve the column so the article width doesn't change with the headings. -->
            <template #right>
                <!-- Stick to the top: there's no site header bar to sit under. -->
                <UContentToc v-if="toc.length" :links="toc" title="On this page" highlight highlight-color="primary"
                    color="primary" :ui="{ root: 'top-0 max-h-full' }" />
                <div v-else />
            </template>
        </UPage>
    </UiContainer>
</template>
