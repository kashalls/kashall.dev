<template>
  <div>
    <div class="h-full flex flex-col sm:pb-0 pb-24 p-4 sm:p-12 container mx-auto">
      <NavigationBar />
      <slot />
    </div>
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'bg-gradient-to-tr from-[#141119] to-[#0e0c12] min-h-screen select-none'
  }
})
</script>
