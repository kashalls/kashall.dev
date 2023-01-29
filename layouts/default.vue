<template>
    <main>
        <slot />
    </main>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'dark:bg-black dark:text-white text-black'
  }
})
</script>