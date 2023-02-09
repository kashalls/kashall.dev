<template>
  <div class="link-container unclickable">
    <a href="mailto:pm@kashall.dev" target="_blank">
      <b-tooltip
        label="Email Me"
        position="is-bottom"
      >
        <Icon name="eva:email-outline" width="36" />
      </b-tooltip>
    </a>
    <a href="https://kashall.dev/gh" target="_blank">
      <b-tooltip
        label="Github"
        position="is-bottom"
      >
        <Icon name="eva:github-outline" width="36" />
      </b-tooltip>
    </a>
    <a href="https://kashall.dev/twitter" target="_blank">
      <b-tooltip
        label="Twitter"
        position="is-bottom"
      >
        <Icon name="eva:twitter-outline" width="36" />
      </b-tooltip>
    </a>
    <a href="https://kashall.dev/steam" target="_blank">
      <b-tooltip
        label="Steam"
        position="is-bottom"
      >
        <Icon name="tabler:brand-steam" width="36" />
      </b-tooltip>
    </a>
    <a href="https://kashall.dev/linkedin" target="_blank">
      <b-tooltip
        label="Linkedin"
        position="is-bottom"
      >
        <Icon name="eva:linkedin-outline" width="36" />
      </b-tooltip>
    </a>
    <a href="https://kashall.dev/sponsor">
      <b-tooltip
        label="Sponsor Me"
        position="is-bottom"
      >
        <Icon name="lucide:dollar-sign" width="36" />
      </b-tooltip>
    </a>
  </div>
</template>

<style scoped>
.link-container {
  margin: 0 auto;
  width: auto;
  display: inline-block;
  position: relative;
  transition: filter 0.2s ease, transform 0.4s ease;
  width: auto;
  display: flex;
  flex-direction: row;

}

.link-square {
  height: 50px;
  width: 50px;
  display: inline-block;
  position: relative;
  margin: 0;
  transition: all 0.2s ease;
}

.link-square:hover {
  filter: brightness(.6);
}

a + a {
  margin-left: 10px;
}
</style>
