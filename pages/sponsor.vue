<template>
  <div>
    <section class="section hero-thingy is-align-content-center is-align-items-center is-justify-content-center is-centered">
      <div class="columns is-mobile is-variable is-8 is-flex">
        <div class="column">
          <h1 class="subtitle is-2 has-text-white">
            Sponsor
          </h1>
          <p class="has-text-white my-4">
            Enjoy using one of my projects or want to support me in some way?<br>
            You can sponsor me using the information on this page!
          </p>
          <p class="has-text-white my-4">
            Sponsorship is not required, but is always welcome.
          </p>
          <h2 class="subtitle is-3 has-text-white">
            Support Me On
          </h2>
          <div class="is-flex is-flex-wrap-wrap pr-4" style="grid-column-gap: 1rem; column-gap: 1rem;">
            <b-button class="is-flex is-size-6" tag="a" type="is-dark" @click="location = 'https://github.com/sponsors/kashall?utm_source=kashall.dev'">
              <i class="fa-brands fa-github fa-1x" /> <span> GitHub Sponsors </span>
            </b-button>
            <b-button class="is-flex is-size-6" type="is-danger" tag="a" @click="location = 'https://patreon.com/sponsors/kashall'">
              <i class="fa-brands fa-patreon" /> <span> Become a Patreon </span>
            </b-button>
          </div>
          <a
            href="https://github.com/sponsors/kashalls"
            class="is-flex is-justify-content-between is-align-contents-center"
          >
            <h2 class="subtitle is-3 has-text-white">Sponsors</h2>
            <i class="fa-brands fa-github" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  data () {
    return {
      sponsors: []
    }
  },
  async fetch () {
    this.sponsors = await this.$axios.$get('https://raw.githubusercontent.com/Kashalls/Kashalls/master/sponsors/sponsors.json')
  },
  head () {
    return {
      title: 'Sponsor ♡'
    }
  }

}
</script>
