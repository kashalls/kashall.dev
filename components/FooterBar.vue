<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container footer-bar is-fluid is-flex is-flex-direction-row py-6 is-justify-content-space-between">
    <div class="is-flex is-flex-direction-row left-container px-6">
      <nuxt-link to="/">
        kashall.dev
      </nuxt-link>
      <span class="mx-4">•</span>
      <a href="https://github.com/kashalls/website">
        View Source
      </a>
      <span class="mx-4">•</span>
      <span class="copyright has-text-link">&#169; {{ new Date().getFullYear() }}</span>
    </div>
    <div class="is-flex is-flex-direction-row right-container">
      <lanyard-spotify />
    </div>
  </div>
</template>

<style scoped>
.left-container {
  left: 0
}
.right-container {
  right: 0
}
.footer-bar {
  bottom: 0;
  z-index: 2;
  min-width: fit-content;
  max-height: max-content;
  position: absolute;
}
</style>
