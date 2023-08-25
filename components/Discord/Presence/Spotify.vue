<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col items-center w-full rounded-xl h-24 bg-opacity-75 shadow"
    :style="`background: url(` + track.album_art_url + `) center`">
    <div class="flex sm:mx-0 xl:mx-auto my-auto w-full">
      <div class="flex flex-row justify-between overflow-hidden w-full">
        <div class="song-info pl-6 font-mono text-white text-shadow shadow-black">
          <h5 class="font-extrabold">
            {{ track.song && track.song.length > 29 ? `${track.song.substring(0, 30)}...` : track.song }}
          </h5>
          <p class="font-semibold">
            {{ track.artist }}
          </p>
        </div>
        <div class="text-center right-0 my-auto pr-3">
          <a class="has-text-white" :href="`https://open.spotify.com/track/` + track.track_id">
            <Icon class="shadow-2xl" name="la:spotify" size="48" color="#1DB954" />
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-row w-full spotify-progress bg-gray-700 overflow-hidden rounded-full h-2">
      <div class="spotify-progressbar bg-gray-800 rounded-full overflow-hidden" :style="`width: ${trackProgress}%`" />
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
  data() {
    return {
      progress: Date.now() - this.track.timestamps.start
    }
  },
  computed: {
    trackLength() {
      return this.track.timestamps.end - this.track.timestamps.start
    },
    trackProgress() {
      return (this.progress / this.trackLength) * 100
    }
  },
  mounted() {
    timer = setInterval(() => {
      this.progress = Date.now() - this.track.timestamps.start
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(timer)
  },
  methods: {
    msToMS(millis) {
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
.spotify-container {
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

.spotify-progress {
  background-color: grey 0.5;
  filter: brightness(70%);
}

.spotify-progressbar {
  color: #c8c8c8;
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
}</style>
