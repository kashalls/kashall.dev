<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).where('draft', '=', false).first(),
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`blog-surround-${route.path}`, () =>
    queryCollectionItemSurroundings('blog', route.path, { fields: ['description'] }).where('draft', '=', false),
)

useSeoMeta({
    title: `${post.value.title} — Jordan Jones`,
    description: post.value.description,
    ogDescription: post.value.description,
    ogType: 'article',
    articlePublishedTime: new Date(post.value.date).toISOString(),
    articleTag: post.value.tags,
})
defineOgImage('Default', {
    title: post.value.title,
    description: post.value.description,
    badge: 'Blog',
})

const date = computed(() => postDate(post.value!.date).toLocaleDateString('en-US', { dateStyle: 'long' }))
const toc = computed(() => post.value?.body?.toc?.links ?? [])
</script>

<template>
    <div v-if="post" class="mx-auto w-full max-w-7xl px-4 py-6 font-stat md:px-8">
        <UPage>
            <template #left>
                <BlogSidebar />
            </template>

            <UPageHeader :headline="post.tags[0] && tagLabel(post.tags[0])" :title="post.title"
                :description="post.description" :ui="{ root: 'pt-0' }">
                <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span class="flex items-center gap-1.5">
                        <UIcon name="i-ph-calendar-blank" class="size-4" />
                        {{ date }}
                    </span>
                    <span v-for="tag in post.tags.slice(1)" :key="tag" class="flex items-center gap-1">
                        <UIcon name="i-ph-hash" class="size-4" />{{ tagLabel(tag) }}
                    </span>
                </div>
            </UPageHeader>

            <UPageBody>
                <ContentRenderer :value="post" />

                <template v-if="surround?.some(Boolean)">
                    <USeparator />
                    <UContentSurround :surround="surround" />
                </template>
            </UPageBody>

            <template v-if="toc.length" #right>
                <!-- Stick to the top: there's no site header bar to sit under. -->
                <UContentToc :links="toc" title="On this page" highlight highlight-color="primary" color="primary"
                    :ui="{ root: 'top-0 max-h-full' }" />
            </template>
        </UPage>
    </div>
</template>
