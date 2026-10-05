<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-index', () =>
    queryCollection('blog')
        .where('draft', '=', false)
        .order('date', 'DESC')
        .select('title', 'description', 'date', 'path', 'tags')
        .all(),
)

useHead({ title: 'Blog — Jordan Jones' })
defineOgImage('Default', {
    title: 'Blog',
    description: 'Notes on Kubernetes, homelabs, and whatever I\'m building.',
})
</script>

<template>
    <div class="mx-auto w-full max-w-7xl px-4 py-6 font-stat md:px-8">
        <UPage>
            <template #left>
                <BlogSidebar />
            </template>

            <UPageHeader title="Blog" description="Notes on Kubernetes, homelabs, and whatever I'm building."
                :ui="{ root: 'pt-0' }" />

            <UPageBody>
                <ul v-if="posts?.length" class="flex flex-col divide-y divide-default">
                    <li v-for="post in posts" :key="post.path" class="py-5 first:pt-0">
                        <NuxtLink :to="post.path" class="group flex flex-col gap-1.5">
                            <span v-if="post.tags[0]" class="text-sm font-semibold text-primary">{{ tagLabel(post.tags[0]) }}</span>
                            <p class="text-lg font-semibold text-highlighted group-hover:text-primary">{{ post.title }}</p>
                            <p v-if="post.description" class="text-muted">{{ post.description }}</p>
                            <span class="text-sm text-muted">{{ postDate(post.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) }}</span>
                        </NuxtLink>
                    </li>
                </ul>
                <UEmpty v-else icon="i-ph-article" title="No posts yet" description="Check back soon." variant="naked" />
            </UPageBody>
        </UPage>
    </div>
</template>
