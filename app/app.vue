<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()
const url = computed(() => new URL(route.path, site.url).href)

useHead({ link: [{ rel: 'canonical', href: url }] })
useSeoMeta({ ogUrl: url })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
