<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

// Each language's own colour, as GitHub shows it, lifted to read on black.
const LANG_COLOR: Record<string, string> = {
  Go: '#00add8',
  Kubernetes: '#5b8def',
  TypeScript: '#4f94e0',
  Nuxt: '#00dc82',
}

const stack = [
  { label: 'Orchestration', items: 'Kubernetes (k3s, k8s), OpenShift, Talos, Podman' },
  { label: 'Languages', items: 'TypeScript, Go, and learning Elixir' },
  { label: 'Frontend', items: 'Nuxt and Vue' },
  { label: 'AI', items: 'Claude, Devin' },
]

// Cached on the server; a project without a count just leaves it off.
const { data: stars } = useFetch('/api/repos', { server: false, lazy: true })

// Hovering a project writes its name into the particle field; a short delay
// keeps a pointer sweeping down the list from churning the dust.
const focus = useState<string | undefined>('field-focus')
let focusTimer: ReturnType<typeof setTimeout> | undefined
function point(name?: string) {
  clearTimeout(focusTimer)
  focusTimer = setTimeout(() => { focus.value = name }, name ? 140 : 260)
}
onBeforeUnmount(() => {
  clearTimeout(focusTimer)
  focus.value = undefined
})
</script>

<template>
  <main class="column">
    <h1>Work</h1>
    <ul class="list">
      <li v-for="project in projects" :key="project.repo">
        <NuxtLink :to="`https://github.com/${project.repo}`" external class="item project"
          @mouseenter="point(project.short)" @mouseleave="point()" @focus="point(project.short)" @blur="point()">
          <span class="project-name">{{ project.name }}</span>
          <span class="item-text">{{ project.description }}</span>
          <span class="item-meta flex flex-wrap items-center gap-x-4 gap-y-1">
            <span class="flex items-center gap-1.5">
              <span class="size-2 rounded-full" :style="{ background: LANG_COLOR[project.lang] }" />
              {{ project.lang }}
            </span>
            <span v-if="stars?.[project.repo] != null" class="tabular-nums">★ {{ stars[project.repo] }}</span>
            <span>{{ project.repo }}</span>
          </span>
        </NuxtLink>
      </li>
    </ul>
    <h2 class="group-label">What I work with</h2>
    <dl class="flex flex-col gap-2">
      <div v-for="row in stack" :key="row.label" class="grid grid-cols-[8rem_1fr] gap-4 text-sm">
        <dt class="text-(--tone-work)">{{ row.label }}</dt>
        <dd class="text-(--fg-2)">{{ row.items }}</dd>
      </div>
    </dl>
  </main>
</template>

<style scoped>
.project-name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1.2;
  color: var(--fg);
  transition: color 200ms;
}

.project:hover .project-name,
.project:focus-visible .project-name {
  color: var(--accent);
}

.project:focus-visible {
  outline: none;
}
</style>
