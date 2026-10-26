<template>
  <div>
    <!-- Full-bleed band: undo the content frame's padding so the fade and rule reach its edges. -->
    <section id="about" class="relative -mx-1 -mt-1 scroll-mt-4 bg-gradient-to-b from-transparent from-30% to-primary-500/20">
      <UiContainer>
        <div class="grid gap-4 xl:grid-cols-5">
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

          <UiPanel title="Technologies" icon="i-ph-stack" class="xl:col-span-3">
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

          <UiPanel title="Portfolio" icon="i-ph-briefcase" class="xl:col-span-2 xl:col-start-4 xl:row-span-2 xl:row-start-1">
            <ul class="flex flex-col divide-y divide-default">
              <li v-for="project in portfolio" :key="project.repo" class="py-3 first:pt-1 last:pb-1">
                <NuxtLink :to="`https://github.com/${project.repo}`" external class="group flex items-start gap-3">
                  <UIcon :name="project.icon" class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-highlighted group-hover:text-primary">{{ project.name }}</p>
                    <p class="text-sm text-muted">{{ project.description }}</p>
                    <p class="mt-1 truncate font-mono text-xs text-dimmed">{{ project.repo }}</p>
                  </div>
                  <UIcon name="i-ph-arrow-up-right" class="mt-1 h-4 w-4 shrink-0 text-muted group-hover:text-primary" />
                </NuxtLink>
              </li>
            </ul>
          </UiPanel>
        </div>
      </UiContainer>
      <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,var(--ui-primary)_30%,var(--ui-primary)_70%,transparent)]" />
    </section>

    <UiContainer class="flex flex-col gap-8">
      <section v-for="section in sections" :id="section.id" :key="section.id" class="flex scroll-mt-4 flex-col gap-3">
        <h2 class="flex items-center gap-2 px-1 text-sm font-semibold text-highlighted">
          <UIcon :name="section.icon" class="h-4 w-4" />
          {{ section.label }}
        </h2>

        <div v-if="section.id === 'writing'" class="grid gap-4 xl:grid-cols-3">
          <UiPanel title="Recently Updated" icon="i-ph-article" class="xl:col-span-2">
            <ul v-if="latestPosts.length" class="flex flex-col divide-y divide-default">
              <li v-for="post in latestPosts" :key="post.path" class="py-3 first:pt-1 last:pb-1">
                <NuxtLink :to="post.path" class="group flex flex-col gap-1">
                  <p class="font-medium text-highlighted group-hover:text-primary">{{ post.title }}</p>
                  <p v-if="post.description" class="text-sm text-muted">{{ post.description }}</p>
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
                    <span v-if="blogSection(post.section)" class="mr-1 flex items-center gap-1" :class="blogSection(post.section)!.accent.text">
                      <UIcon :name="blogSection(post.section)!.icon" class="size-3.5" />
                      {{ blogSection(post.section)!.label }}
                    </span>
                    <UBadge v-for="tag in post.tags" :key="tag" :label="`#${tag}`" color="primary" variant="subtle" size="sm" />
                    <span class="ml-auto shrink-0 font-normal text-dimmed">
                      {{ post.updated ? 'Updated ' : '' }}{{ formatDate(lastChange(post)) }}
                    </span>
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
  </div>
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
const sections = homeSections.filter(section => section.id !== 'about')

const portfolio = [
  { name: 'External-DNS UniFi Webhook', repo: 'home-operations/external-dns-unifi-webhook', icon: 'i-simple-icons-go', description: 'ExternalDNS webhook provider that manages DNS records on UniFi gateways.' },
  { name: 'Kromgo', repo: 'home-operations/kromgo', icon: 'i-simple-icons-go', description: 'Builds badges and graphs from PromQL queries to share in READMEs.' },
  { name: 'Infrastructure', repo: 'waifulabs/infrastructure', icon: 'i-simple-icons-kubernetes', description: 'My Kubernetes homelab, run with Talos, Flux, Renovate and GitHub Actions.' },
  { name: 'Openterface Viewer', repo: 'kashalls/openterface-viewer', icon: 'i-simple-icons-typescript', description: 'Proof-of-concept Openterface viewer that runs in the browser.' },
  { name: 'ok8.sh', repo: 'kashalls/ok8.sh', icon: 'i-simple-icons-nuxt', description: 'This site: Nuxt on Cloudflare Workers.' },
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
