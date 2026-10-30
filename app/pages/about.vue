<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

const { openContact } = useContact()
</script>

<template>
  <main class="column">
    <h1 class="page-name">About</h1>
    <p class="lead tone-who">I'm <span>Jordan</span>, a <span>platform engineer</span> with a <span>software engineering background</span>.</p>
    <p class="prose-p tone-work">I design and maintain <span>Kubernetes infrastructure</span> and write <span>tooling that makes platforms more extensible</span>. Most of it gets tried on my homelab first.</p>
    <p class="prose-p tone-side">On the side I provide <span>residential and business IT services</span>, <span>full&#8209;stack web development</span> and <span>managed infrastructure</span>. I'm available for consultancy inside the United States.</p>
    <p class="prose-p">I hold the Linux Foundation's <a class="inline-link" href="https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/">Kubernetes and Cloud Native Associate</a> certification.</p>
    <ul class="socials" aria-label="Elsewhere">
      <li v-for="social in socials" :key="social.to">
        <a :href="social.to" target="_blank" rel="noopener" :aria-label="social.label" :title="social.label" class="social"
          :style="{ '--social': social.color }">
          <UIcon :name="social.iconFill" />
        </a>
      </li>
      <li>
        <button type="button" aria-label="Email me" title="Email me" class="social" style="--social: #c2a5ff" @click="openContact()">
          <UIcon name="i-ph-envelope-simple-fill" />
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.socials {
  display: flex;
  gap: 1.25rem;
  margin-top: 2rem;
}

.social {
  display: flex;
  font-size: 1.6rem;
  color: var(--social);
  opacity: 0.85;
  transition: opacity 200ms, filter 200ms;
}

.social:hover,
.social:focus-visible {
  opacity: 1;
  filter: drop-shadow(0 0 6px var(--social));
}
</style>
