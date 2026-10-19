<template>
  <UiContainer class="flex flex-col gap-8">
    <section v-for="section in homeSections" :id="section.id" :key="section.id" class="flex scroll-mt-4 flex-col gap-3">
      <h2 v-if="section.id !== 'about'" class="flex items-center gap-2 px-1 text-sm font-semibold text-highlighted">
        <UIcon :name="section.icon" class="h-4 w-4" />
        {{ section.label }}
      </h2>

      <div v-if="section.id === 'about'" class="grid gap-4 xl:grid-cols-5">
        <UiPanel title="Hello There" icon="i-ph-hand-waving" :padded="false" class="xl:col-span-3">
          <ProfileHeader />
          <div class="flex flex-1 flex-col p-4">
            <div
              class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
              <p>Hi, I'm <span class="text-primary">Jordan</span>, a <span class="text-blue-500">Platform
                  Engineer</span> with a <span class="text-purple-600 dark:text-purple-400">software engineering background</span>.</p>
              <p>I design and maintain <span class="text-pink-500">Kubernetes infrastructure</span> and write <span
                  class="text-orange-600 dark:text-orange-400">tooling that makes platforms more extensible</span>.</p>
              <p>On the side, I provide <span class="text-green-600 dark:text-green-400">Residential &amp; Business IT Services</span>,
                <span class="text-red-600 dark:text-red-400">Full-stack Web Development</span> &amp; <span
                  class="text-yellow-700 dark:text-yellow-300">Managed
                  Infrastructure Services</span>.
              </p>
            </div>
            <div class="mt-3 flex flex-col gap-1.5 border-t border-default p-1 pt-3 text-sm text-toned">
              <p class="flex items-center gap-2">
                <UIcon name="i-ph-map-pin" class="h-4 w-4 shrink-0 text-primary" />
                <span>Based in <ULink to="https://en.wikipedia.org/wiki/Eugene,_Oregon" external
                    inactive-class="text-primary">Eugene, Oregon</ULink> · available for consultancy inside the United
                  States.</span>
              </p>
              <p class="flex items-center gap-2">
                <UIcon name="i-ph-certificate" class="h-4 w-4 shrink-0 text-primary" />
                <ULink to="https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/"
                  external inactive-class="text-blue-500">Linux Foundation: KCNA</ULink>
              </p>
            </div>
          </div>
        </UiPanel>

        <div class="flex flex-col gap-4 xl:col-span-2">
          <UiPanel title="Technologies" icon="i-ph-stack" class="flex-1">
            <div class="grid gap-3 p-1 sm:grid-cols-3">
              <div class="flex flex-col gap-3">
                <div>
                  <p class="text-green-500">Frontend</p>
                  <ol
                    class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                    <li>Nuxt / Vue</li>
                    <li>
                      <UTooltip text="I no longer work with these technologies">
                        <span class="cursor-help text-dimmed line-through">Wordpress / PHP</span>
                      </UTooltip>
                    </li>
                  </ol>
                </div>
                <div>
                  <p class="text-purple-600 dark:text-purple-400">Artificial Intelligence</p>
                  <ol
                    class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                    <li>Claude</li>
                    <li>Devin</li>
                  </ol>
                </div>
              </div>
              <div>
                <p class="text-blue-500">Orchestration</p>
                <ol
                  class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                  <li>k3s / k8s (Kubernetes)</li>
                  <li>OpenShift</li>
                  <li>Talos</li>
                  <li>Podman</li>
                  <li>
                    <UTooltip text="I no longer work with these technologies">
                      <span class="cursor-help text-dimmed line-through">Rancher</span>
                    </UTooltip>
                  </li>
                </ol>
              </div>
              <div>
                <p class="text-red-500">Languages</p>
                <ol
                  class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                  <li>Javascript / Typescript</li>
                  <li>Golang</li>
                  <li>Elixir <UBadge label="Learning" color="primary" variant="subtle" size="sm" class="ml-1 align-middle" /></li>
                  <li>
                    <UTooltip text="I no longer work with these technologies">
                      <span class="cursor-help text-dimmed line-through">Java</span>
                    </UTooltip>
                  </li>
                  <li>
                    <UTooltip text="I no longer work with these technologies">
                      <span class="cursor-help text-dimmed line-through">C / C++</span>
                    </UTooltip>
                  </li>
                </ol>
              </div>
            </div>
          </UiPanel>

          <div class="grid gap-3 sm:grid-cols-2">
            <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to" :external="link.external"
              class="group flex items-center gap-3 rounded-lg border border-default bg-elevated/40 p-3 transition-colors hover:border-primary/50 hover:bg-elevated">
              <UIcon :name="link.icon" class="h-6 w-6 shrink-0 text-primary" />
              <div class="min-w-0 flex-1">
                <p class="font-medium text-highlighted">{{ link.label }}</p>
                <p class="truncate font-mono text-xs text-muted">{{ link.to }}</p>
              </div>
              <UIcon name="i-ph-arrow-right" class="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else-if="section.id === 'writing'" class="grid gap-4 xl:grid-cols-3">
        <UiPanel title="Recently Updated" icon="i-ph-article" class="xl:col-span-2">
          <ul v-if="latestPosts.length" class="flex flex-col divide-y divide-default">
            <li v-for="post in latestPosts" :key="post.path" class="py-3 first:pt-1 last:pb-1">
              <NuxtLink :to="post.path" class="group flex flex-col gap-1">
                <div class="flex items-baseline justify-between gap-4">
                  <p class="font-medium text-highlighted group-hover:text-primary">{{ post.title }}</p>
                  <span class="shrink-0 text-xs text-dimmed">
                    {{ post.updated ? 'Updated ' : '' }}{{ formatDate(lastChange(post)) }}
                  </span>
                </div>
                <p v-if="post.description" class="text-sm text-muted">{{ post.description }}</p>
                <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
                  <span v-if="blogSection(post.section)" class="flex items-center gap-1" :class="blogSection(post.section)!.accent.text">
                    <UIcon :name="blogSection(post.section)!.icon" class="size-3.5" />
                    {{ blogSection(post.section)!.label }}
                  </span>
                  <span v-for="tag in post.tags" :key="tag" class="text-primary">#{{ tag }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
          <UEmpty v-else icon="i-ph-article" title="No posts yet" variant="naked" />
          <UButton v-if="posts?.length" to="/posts" label="All posts" trailing-icon="i-ph-arrow-right" color="neutral"
            variant="link" size="xs" class="mt-2 self-end" />
        </UiPanel>

        <UiPanel title="Things I Like To Talk About" icon="i-ph-chats-circle">
          <div class="flex flex-wrap gap-2 p-1">
            <UBadge v-for="topic in topics" :key="topic.label" :label="topic.label" color="primary" variant="subtle"
              size="lg" :class="!topic.count && 'opacity-60'">
              <template v-if="topic.count" #trailing>
                <span class="rounded-md bg-primary-500/20 px-1 text-xs tabular-nums">{{ topic.count }}</span>
              </template>
            </UBadge>
          </div>
        </UiPanel>
      </div>

      <div v-else-if="section.id === 'live'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UiPanel title="GitHub" icon="i-ph-github-logo">
          <GithubStats />
        </UiPanel>

        <UiPanel title="Homelab" icon="i-simple-icons-kubernetes">
          <HomelabStats />
        </UiPanel>

        <UiPanel title="Status" icon="i-ph-heartbeat" class="md:col-span-2 xl:col-span-1">
          <HomelabUptime />
        </UiPanel>
      </div>

      <GamesList v-else-if="section.id === 'games'" />
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('title', 'description', 'date', 'updated', 'path', 'tags', 'section')
    .all(),
)

// Docs and guides change in place, so rank by the latest edit, not first publish.
const lastChange = (post: { date: string | Date, updated?: string | Date }) => postDate(post.updated ?? post.date)
const quickLinks = [
  { label: 'Homelab', to: '/lab', icon: 'i-simple-icons-kubernetes' },
  { label: 'GitHub', to: '/git', icon: 'i-ph-github-logo', external: true },
]

const latestPosts = computed(() => [...posts.value ?? []]
  .sort((a, b) => lastChange(b).getTime() - lastChange(a).getTime())
  .slice(0, 3))

// Each topic counts posts carrying any of its tags.
const topics = computed(() => [
  { label: 'Kubernetes', tags: ['kubernetes', 'k8s'] },
  { label: 'Talos Linux', tags: ['talos'] },
  { label: 'GitOps & Flux', tags: ['gitops', 'flux'] },
  { label: 'Homelabs', tags: ['homelab'] },
  { label: 'Go', tags: ['go', 'golang'] },
  { label: 'Nuxt & Vue', tags: ['nuxt', 'vue'] },
  { label: 'Home Assistant', tags: ['home-assistant'] },
  { label: 'World of Warcraft', tags: ['wow', 'warcraft'] },
  { label: 'Overwatch', tags: ['overwatch'] },
].map(topic => ({
  ...topic,
  count: posts.value?.filter(post => (post.tags ?? []).some(tag => topic.tags.includes(tag))).length ?? 0,
})))


defineOgImage('Default', {
  title: 'Jordan Jones',
  description: 'Freelance Software Engineer — integrations, full-stack & infrastructure.',
})
</script>
