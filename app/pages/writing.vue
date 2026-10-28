<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

const { sections } = await useBlogNavigation()

const query = ref('')
const search = () => query.value.trim() && navigateTo({ path: '/posts', query: { q: query.value.trim() } })
</script>

<template>
  <main class="column">
    <h1 class="page-name">Writing</h1>
    <form role="search" class="flex items-end gap-6" @submit.prevent="search">
      <input v-model="query" type="search" placeholder="Search every post" aria-label="Search posts" class="search-input">
      <a href="/feed.xml" target="_blank" class="shrink-0 pb-2.5 text-sm text-(--fg-3) hover:text-(--fg)">RSS</a>
    </form>

    <!-- Every section, its groups and posts, in the order the posts pages use. -->
    <section v-for="section in sections" :key="section.id" :aria-labelledby="`section-${section.id}`">
      <h2 :id="`section-${section.id}`" class="group-label" :style="{ color: section.hue }">{{ section.label }}</h2>
      <div v-for="category in section.categories" :key="category.id" class="mb-6">
        <h3 class="mb-3 text-sm text-(--fg-3)">{{ category.title }}</h3>
        <ul class="list">
          <li v-for="post in category.posts" :key="post.path">
            <NuxtLink :to="post.path" class="item">
              <span class="item-title">{{ post.title }}</span>
              <span v-if="post.description" class="item-text">{{ post.description }}</span>
              <span class="item-meta">{{ formatDate(postDate(post.date)) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
