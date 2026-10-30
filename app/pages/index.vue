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
    <div class="home-about">
      <p class="tone-who">Hi, I'm <span>Jordan</span>, a <span>Platform Engineer</span> with a <span>software engineering background</span>.</p>
      <p class="tone-work">I design and maintain <span>Kubernetes infrastructure</span> and write <span>tooling that makes platforms more extensible</span>.</p>
      <p class="tone-side">On the side, I provide <span>Residential &amp; Business IT Services</span>, <span>Full&#8209;stack Web Development</span> &amp; <span>Managed Infrastructure Services</span>.</p>
    </div>
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

.home-about {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-width: 46rem;
  margin-bottom: clamp(1rem, 3vh, 1.75rem);
  font-size: clamp(1rem, 1.35vw, 1.15rem);
  line-height: 1.5;
  text-wrap: balance;
}

/* Grey, so each sentence's coloured phrases stand out. */
.home-about p {
  color: var(--fg-2);
}
</style>
