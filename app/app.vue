<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()
const url = computed(() => new URL(route.path, site.url).href)

useHead({
  link: [
    { rel: 'canonical', href: url },
    { rel: 'alternate', type: 'application/atom+xml', title: 'Jordan Jones', href: '/feed.xml' },
  ],
})
useSeoMeta({ ogUrl: url })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
