<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

defineOgImage('Default', {
  title: 'Jordan Jones',
  description: 'Freelance Software Engineer — integrations, full-stack & infrastructure.',
})
</script>

<template>
  <main class="home">
    <ClientOnly>
      <HomePresence />
    </ClientOnly>
    <h1 class="home-name">Jordan Jones</h1>
  </main>
</template>

<style scoped>
.home {
  position: absolute;
  z-index: 4;
  left: clamp(1.25rem, 4vw, 3.5rem);
  right: clamp(1.25rem, 4vw, 3.5rem);
  bottom: clamp(1rem, 4vh, 2.5rem);
}

.home-name {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 11vw, 10.5rem);
  line-height: 0.82;
  letter-spacing: -0.035em;
  color: var(--fg);
}
</style>
