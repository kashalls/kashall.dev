<template>
  <div>
    <template v-if="!lanyard || !lanyard.spotify">
      <p class="">
        <span>Not listening to anything.</span>
        <span>
          <i class="fab fa-spotify" />
        </span>
      </p>
    </template>
    <template v-else>
      <b-tooltip
        type="is-dark"
        position="is-bottom"
        animated
        multilined
      >
        <a target="_blank" rel="noreferrer" class="" :href="`https://open.spotify.com/track/${lanyard.spotify.track_id}`">
          <span class="">Listening to "{{ lanyard.spotify.song }}" by {{ lanyard.spotify.artist }}</span>
          <span><i class="fab fa-spotify" /></span>
        </a>
        <template #content>
          <b-image
            :src="lanyard.spotify.album_art_url"
            custom-class="spotify-art"
            alt="Now Playing On Spotify"
            ratio="4by3"
          >
            <template #placeholder>
              <b-skeleton
                class="skeleton-placeholder"
                height="100%"
              />
            </template>
          </b-image>
        </template>
      </b-tooltip>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lanyard: null,
      lanyardSocket: null,
      userId: '201077739589992448'
    }
  },
  async mounted () {
    this.lanyardSocket = await this.$lanyard({
      userId: this.userId,
      socket: true
    })
    this.lanyardSocket.addEventListener('message', ({ data }) => {
      // Parse and destructure data object and assing t to type, d to status
      const { d: status } = JSON.parse(data)
      this.lanyard = status
    })
  },
  beforeDestroy () {
    this.lanyardSocket?.close()
  }
}
</script>

<style>
.spotify-art {
  max-height: fit-content !important;
}
</style>
