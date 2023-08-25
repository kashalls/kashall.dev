<template>
  <div class="w-full min-h-screen flex items-center flex-col overflow-x-hidden bg-gradient-to-tr from-[#141119] to-[#0e0c12]">
    <NavigationBar />
    <div class="flex flex-col items-center justify-center w-full box-border">
      <main class="w-full box-border pb-10 mt-[65px]">
        <slot />
      </main>
    </div>
    <FooterBar />
  </div>
</template>

<script>
import NavigationBar from '~/components/NavigationBar.vue'
import FooterBar from '~/components/FooterBar.vue'
export default {
  name: 'DefaultLayout',
  components: { NavigationBar, FooterBar }
}
</script>
