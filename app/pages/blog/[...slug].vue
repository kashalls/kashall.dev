<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).where('draft', '=', false).first(),
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useHead({ title: `${post.value.title} — Jordan Jones` })
defineOgImage('Default', {
    title: post.value.title,
    description: post.value.description,
    badge: 'Blog',
})

const date = computed(() => postDate(post.value!.date).toLocaleDateString('en-US', { dateStyle: 'long' }))
</script>

<template>
    <div v-if="post" class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-2 md:p-4">
        <UButton to="/blog" icon="i-ph-arrow-left" label="All posts" color="neutral" variant="link" class="self-start" />

        <UiPanel :title="post.title" icon="i-ph-article">
            <header class="mb-6 flex flex-col gap-2 border-b border-gray-900 pb-4">
                <h1 class="text-3xl font-bold text-white">{{ post.title }}</h1>
                <p v-if="post.description" class="text-neutral-400">{{ post.description }}</p>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span class="text-neutral-500">{{ date }}</span>
                    <span v-for="tag in post.tags" :key="tag" class="font-medium text-primary-400">#{{ tag }}</span>
                </div>
            </header>

            <ContentRenderer :value="post" class="font-stat" />
        </UiPanel>
    </div>
</template>
