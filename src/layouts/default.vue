<template>
  <div>
    <div class="h-full flex flex-col sm:pb-0 pb-24 p-4 sm:p-12 container mx-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'bg-gradient-to-tr from-[#0e0c12] to-[#0e0f0f] min-h-screen select-none'
  }
})
</script>
