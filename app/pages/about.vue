<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })
</script>

<template>
  <main class="column">
    <h1 class="page-name">About</h1>
    <p class="lead tone-who">I'm <span>Jordan</span>, a <span>platform engineer</span> with a <span>software engineering background</span>.</p>
    <p class="prose-p tone-work">I design and maintain <span>Kubernetes infrastructure</span> and write <span>tooling that makes platforms more extensible</span>. Most of it gets tried on my homelab first.</p>
    <p class="prose-p tone-side">On the side I provide <span>residential and business IT services</span>, <span>full&#8209;stack web development</span> and <span>managed infrastructure</span>. I'm available for consultancy inside the United States.</p>
    <p class="prose-p">I hold the Linux Foundation's <a class="inline-link" href="https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/">Kubernetes and Cloud Native Associate</a> certification.</p>
  </main>
</template>
