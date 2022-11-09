<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="footer-bar">
    <div class="container m-auto is-flex is-flex-direction-row py-6 is-align-content-center is-justify-content-space-between">
      <div class="is-flex is-flex-direction-row left-container mx-6">
        <span class="is-clickable" @click="moon"><i class="fa-solid fa-moon" /></span>
        <span class="mx-4 is-unselectable">•</span>
        <nuxt-link to="/" class="is-unselectable">
          kashall.dev
        </nuxt-link>
      </div>
      <div class="is-flex is-flex-direction-row right-container mx-6">
        <a class="is-unselectable" href="https://github.com/kashalls/website">
          View Source
        </a>
        <span class="mx-4 is-unselectable">•</span>
        <span class="copyright has-text-link is-unselectable">{{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      count: 0,
      timer: null
    }
  },
  methods: {
    moon () {
      if (this.timer) { return }
      if (this.count === 0) {
        this.$buefy.toast.open('Light mode could hurt your eyes.\n I don\'t recommend it.')
      }
      if (this.count === 1) {
        this.$buefy.toast.open('I\'m only trying to help. I don\'t think light mode was ever the right choice.')
      }
      if (this.count === 3) {
        this.$buefy.toast.open('Stop! You don\'t want this to happen!')
      }
      if (this.count === 5) {
        this.$buefy.toast.open('Don\'t do this!')
      }
      if (this.count === 10) {
        this.$buefy.toast.open('I\'ve had it with your button mashing! You deserve this!')
        // eslint-disable-next-line no-return-assign
        setTimeout(() => location = 'https://youtu.be/bpU6w-kUKNE?t=29', 2000)
      }
      this.handleTimerCount()
    },
    handleTimerCount () {
      // eslint-disable-next-line no-return-assign
      this.timer = setTimeout(() => this.timer = null, 2000)
      this.count++
    }
  }
}
</script>

<style scoped>
.left-container {
  left: 0
}
.right-container {
  right: 0;
  float: right;
}
.footer-bar {
  position: absolute;
  z-index: 2;
  bottom: 0;
  width: 100%;
}
</style>
