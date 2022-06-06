<template>
  <div class="link-container unclickable" style="color: white;">
    <a href="https://jordanjones.org/discord" target="_blank">
      <div class="link-square unclickable" title="Discord Server">
        <i class="fab fa-discord fa-2x" />
      </div>
    </a>
    <a href="https://steamcommunity.com/id/kashall" target="_blank">
      <div class="link-square" title="Steam">
        <i class="fab fa-steam fa-2x" />
      </div>
    </a>
    <a href="https://github.com/Kashalls" target="_blank">
      <div class="link-square" title="Github">
        <i class="fab fa-github fa-2x" />
      </div>
    </a>
    <a href="https://twitter.com/Kashalls" target="_blank">
      <div class="link-square" title="Twitter">
        <i class="fab fa-twitter fa-2x" />
      </div>
    </a>
    <a href="https://instagram.com/kashalls" target="_blank">
      <div class="link-square" title="Instagram">
        <i class="fab fa-instagram fa-2x" />
      </div>
    </a>
    <a href="https://reddit.com/u/kashall" target="_blank">
      <div class="link-square" title="Reddit">
        <i class="fab fa-reddit fa-2x" />
      </div>
    </a>
    <a href="https://twitch.tv/kashalls" target="_blank">
      <div class="link-square" title="Twitch">
        <i class="fab fa-twitch fa-2x" />
      </div>
    </a>
  </div>
</template>

<style scoped>
.link-container {
  margin: 0 auto;
  width: auto;
  display: inline-block;
  position: relative;
  margin: 0;
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
</style>
