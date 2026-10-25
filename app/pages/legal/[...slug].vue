<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`legal-${route.path}`, () =>
    queryCollection('legal').path(route.path).first(),
)

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
    title: page.value.title,
    description: page.value.description,
    ogDescription: page.value.description,
})
useRobotsRule(false)

defineOgImage('Default', {
    title: page.value.title,
    description: page.value.description,
})

const updated = computed(() => formatDate(postDate(page.value!.updated)))
</script>

<template>
    <UiContainer v-if="page">
        <UPage :ui="{ center: 'w-full max-w-[45rem] justify-self-center' }">
            <UPageHeader :title="page.title" :ui="{ root: 'pt-0', title: 'font-display' }">
                <p class="mt-3 text-sm text-muted">
                    Last updated <time :datetime="new Date(page.updated).toISOString()">{{ updated }}</time>
                </p>
            </UPageHeader>

            <UPageBody>
                <ContentRenderer :value="page" />
            </UPageBody>
        </UPage>
    </UiContainer>
</template>
