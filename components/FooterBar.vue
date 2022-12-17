<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="footer-bar">
    <div class="container m-auto is-flex is-flex-direction-row py-6 is-align-content-center is-justify-content-space-between">
      <div class="is-flex is-flex-direction-row left-container mx-6">
        <span class="is-clickable"><iconify-icon icon="fa6-regular:moon" /></span>
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
    <a rel="me" href="https://mastodon.social/@kashall" />
  </footer>
</template>

<style scoped>
.left-container {
  left: 0
}
.right-container {
  right: 0;
  float: right;
}
.footer-bar {
  z-index: 2;
  bottom: 0;
  width: 100%;
}
</style>
