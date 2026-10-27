<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

const { data: posts } = await useAsyncData('field-writing', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .select('title', 'description', 'date', 'updated', 'path', 'section')
    .all(),
)

const lastChange = (post: { date: string | Date, updated?: string | Date }) => postDate(post.updated ?? post.date)
const latest = computed(() => [...posts.value ?? []]
  .sort((a, b) => lastChange(b).getTime() - lastChange(a).getTime())
  .slice(0, 10))
</script>

<template>
  <main class="column">
    <h1>Writing</h1>
    <ul class="list">
      <li v-for="post in latest" :key="post.path">
        <NuxtLink :to="post.path" class="item">
          <span class="item-title">{{ post.title }}</span>
          <span v-if="post.description" class="item-text">{{ post.description }}</span>
          <span class="item-meta">
            <span :class="blogSection(post.section)?.accent.text">{{ blogSection(post.section)?.label }}</span>, {{ post.updated ? 'updated ' : '' }}{{ formatDate(lastChange(post)) }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
