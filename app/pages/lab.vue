<script setup lang="ts">
const { data: posts } = await useAsyncData('lab-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .where('section', 'IN', ['homelab', 'guides'])
    .select('title', 'description', 'path', 'section', 'icon', 'order', 'date')
    .order('order', 'ASC')
    .all(),
)

const groups = computed(() => (['homelab', 'guides'] as const).map(id => ({
  section: blogSection(id)!,
  posts: (posts.value ?? []).filter(post => post.section === id),
})))

useSeoMeta({
  title: 'Home Lab',
  description: 'A Talos Kubernetes cluster run with GitOps: live metrics, service status and write-ups.',
})

defineOgImage('Default', {
  title: 'Home Lab',
  description: 'A Talos Kubernetes cluster run with GitOps.',
})
</script>

<template>
  <UiContainer class="flex flex-col gap-6">
    <div class="flex flex-col gap-2 px-1">
      <h1 class="flex items-center gap-2 text-2xl font-bold text-highlighted">
        <UIcon name="i-simple-icons-kubernetes" class="h-6 w-6 text-primary" />
        Home Lab
      </h1>
      <p class="max-w-3xl text-toned">
        A <span class="text-blue-600 dark:text-blue-400">Talos</span> Kubernetes cluster, managed with
        <span class="text-pink-600 dark:text-pink-400">Flux</span> from a single Git repository. These numbers come
        straight from the cluster.
      </p>
      <div class="flex flex-wrap gap-2 pt-1">
        <UButton to="/git" external label="GitHub" icon="i-ph-github-logo" color="neutral" variant="outline"
          size="sm" />
        <UButton to="https://status.ok8.sh" target="_blank" label="Status page" icon="i-ph-heartbeat" color="neutral"
          variant="outline" size="sm" />
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <UiPanel title="Cluster" icon="i-simple-icons-kubernetes">
        <HomelabStats />
      </UiPanel>

      <UiPanel title="Status" icon="i-ph-heartbeat">
        <HomelabUptime />
      </UiPanel>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <UiPanel v-for="group in groups" :key="group.section.id" :title="group.section.label" :icon="group.section.icon">
        <ul v-if="group.posts.length" class="flex flex-col divide-y divide-default">
          <li v-for="post in group.posts" :key="post.path" class="py-2.5 first:pt-1 last:pb-1">
            <NuxtLink :to="post.path" class="group flex items-start gap-3">
              <UIcon :name="post.icon ?? 'i-ph-file-text'" class="mt-0.5 h-4 w-4 shrink-0" :class="group.section.accent.text" />
              <div class="min-w-0">
                <p class="font-medium text-highlighted group-hover:text-primary">{{ post.title }}</p>
                <p v-if="post.description" class="line-clamp-2 text-sm text-muted">{{ post.description }}</p>
              </div>
            </NuxtLink>
          </li>
        </ul>
        <UEmpty v-else :icon="group.section.icon" title="Nothing here yet" variant="naked" />
      </UiPanel>
    </div>
  </UiContainer>
</template>
