<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="spotify-presence" :style="`background: url(`+ track.album_art_url + `) center`">
    <div class="spotify-container">
      <div class="spotify-info">
        <div class="song-info pl-3">
          <h5 class="title is-6 spotify-text is-spaced has-text-white">
            {{ track.song && track.song.length > 29 ? `${track.song.substring(0, 30)}...` : track.song }}
          </h5>

          <h6 class="subtitle is-6 spotify-text has-text-white">
            {{ track.artist }}
          </h6>
        </div>
        <div class="song-link pr-3">
          <a class="has-text-white" :href="`https://open.spotify.com/track/` + track.track_id">Listen On Spotify<iconify-icon icon="la:spotify" inline="true" /></a>
        </div>
      </div>
    </div>
    <div class="spotify-progress">
      <div class="spotify-progressbar" :style="`width: ${trackProgress}%`">
        <p class="spotify-progresstext" :style="`filter: ${trackProgress > 15 ? 'inverted()' : 'none'}`">
          {{ msToMS(progress) }} : {{ msToMS(track.timestamps.end - track.timestamps.start) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

let timer = null

export default {
  props: {
    track: {
      type: Object,
      required: true,
      default: () => { return {} }
    }
  },
  data () {
    return {
      progress: Date.now() - this.track.timestamps.start
    }
  },
  computed: {
    trackLength () {
      return this.track.timestamps.end - this.track.timestamps.start
    },
    trackProgress () {
      return (this.progress / this.trackLength) * 100
    }
  },
  mounted () {
    timer = setInterval(() => {
      this.progress = Date.now() - this.track.timestamps.start
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(timer)
  },
  methods: {
    msToMS (millis) {
      const minutes = Math.floor(millis / 60000)
      const seconds = Number(((millis % 60000) / 1000).toFixed(0))
      return seconds === 60
        ? minutes + 1 + ':00'
        : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  }
}
</script>

<style scoped>
.spotify-presence {
    border-radius: 10px;
    width: 100%;
    height: 85px;
    background-color: #34344f;
    box-shadow: 2px 2px 20px 0px #00000086;
    align-items: center;
    display: flex;
    margin-top: 25px;
    flex-direction: column;
    text-align: left;
    background-size: 100%;
}
.spotify-container {
    display: flex;
    align-items: center;
    margin: auto;
    width: 100%;
}

.spotify-text {
    margin-left: 10px;
    margin-top: 1px;
    margin-bottom: 3px;
    padding-right: 20px;
}

.spotify-image {
    cursor: pointer;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.spotify-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-height: 80px;
    width: 100%;
    overflow: hidden;
    text-shadow: 2px 2px black;
}

.song-link {
    text-align: center;
    right: 0;
    margin-top: auto;
    margin-bottom: auto;
    color: white;
}

.spotify-progress {
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  width: 100%;
  height: 10px;
  background-color: grey 0.5;
  filter: brightness(70%);
  overflow: hidden;
  flex-direction: row;
  display: flex;
}
.spotify-progressbar {
  height: 10px;
  border-bottom-left-radius: 30px;
  border-top-right-radius: 30px;
  overflow: hidden;
  color: #c8c8c8;
  background-color: #4365d5;
  width: 0%;
  transition: all 1000ms linear;
  transition: color 100ms linear;
  transition: background-color 100ms linear;
}
.spotify-progresstext {
  float: right;
  padding-right: 5px;
  padding-left: 5px;
  color: black;
  margin: 0px;
  font-size: 8px;
  transition: all 500ms linear;
}
</style>
