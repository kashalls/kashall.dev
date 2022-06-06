<template>
  <section class="section is-align-content-center is-align-items-center m-auto is-justify-content-center is-centered is-large">
    <div class="columns is-mobile is-flex">
      <div class="column is-vcentered">
        <Kashall />
      </div>
    </div>
  </section>
</template>

<script>
import Kashall from '~/components/Kashall.vue'

export default {
  name: 'IndexPage',
  components: {
    Kashall
  }
}
</script>
