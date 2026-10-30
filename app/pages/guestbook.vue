<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })
</script>

<template>
  <main class="column">
    <h1 class="page-name">Guestbook</h1>
    <p class="lead">Passing through? Say hello, or leave a note for the next visitor.</p>
    <BlogComments path="/guestbook" guestbook class="mt-8" />
  </main>
</template>
