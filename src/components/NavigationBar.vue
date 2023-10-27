<template>
  <nav class="p-7 w-full top-0 left-0 pb-4">
    <div class="container flex flex-wrap items-center justify-center md:justify-between mx-auto">
      <NuxtLink to="/" class="flex items-center">
        <NuxtImg class="h-8 mr-3 shadow" src="/jordanjones.svg" alt="Jordan Jones's Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white shadow">Jordan Jones</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const showMenu = ref(false)
const toggleNav = () => (showMenu.value = !showMenu.value)
</script>