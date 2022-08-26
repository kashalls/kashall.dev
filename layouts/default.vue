<template>
  <div>
    <NavigationBar />
    <section class="main-content">
      <div class="container">
        <Nuxt />
      </div>
    </section>
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
