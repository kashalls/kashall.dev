<script setup lang="ts">
const route = useRoute()
const { sections, current, active } = await useBlogNavigation()
</script>

<template>
    <div>
        <ul class="flex flex-col gap-1 text-sm">
            <li v-for="section in sections" :key="section.id">
                <NuxtLink :to="section.first" class="group flex items-center gap-3 py-1 pl-4 font-medium transition-colors"
                    :class="section.id === current ? section.accent.text : 'text-muted hover:text-highlighted'">
                    <span class="flex size-6 items-center justify-center rounded-md ring-1 transition-colors"
                        :class="[section.accent.text, section.accent.ring, section.id === current && section.accent.bg]">
                        <UIcon :name="section.icon" class="size-4" />
                    </span>
                    {{ section.label }}
                </NuxtLink>
            </li>
        </ul>
        <nav v-if="active" class="mt-8 flex flex-col gap-8 text-sm">
            <div v-for="category in active.categories" :key="category.id">
                <h3 class="mb-2.5 pl-4 font-semibold text-highlighted">{{ category.title }}</h3>
                <ul class="flex flex-col gap-px">
                    <li v-for="post in category.posts" :key="post.path">
                        <NuxtLink :to="post.path"
                            class="group flex items-center gap-2.5 rounded-md py-1.5 pr-3 pl-4 transition-colors"
                            :class="post.path === route.path
                                ? [active.accent.bg, active.accent.text, 'font-medium']
                                : 'text-muted hover:bg-elevated/50 hover:text-highlighted'">
                            <UIcon v-if="post.icon" :name="post.icon" class="size-4 shrink-0" :class="active.accent.text" />
                            <span class="min-w-0 flex-1">{{ post.sidebarTitle ?? post.title }}</span>
                            <span v-if="active.dated" class="shrink-0 text-xs text-dimmed">{{ formatDate(postDate(post.date), { year: false }) }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>
