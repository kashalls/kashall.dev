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
    <div class="flex w-full flex-col gap-4 p-2 md:p-4">
        <UiPanel title="Blog" icon="i-ph-article">
            <UBlogPosts v-if="posts?.length" orientation="vertical">
                <UBlogPost v-for="post in posts" :key="post.path" :title="post.title"
                    :description="post.description" :date="postDate(post.date)" :to="post.path"
                    :badge="post.tags[0] ? `#${post.tags[0]}` : undefined" variant="ghost" />
            </UBlogPosts>
            <UEmpty v-else icon="i-ph-article" title="No posts yet" description="Check back soon." variant="naked" />
        </UiPanel>
    </div>
</template>
