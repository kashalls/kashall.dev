<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="presence" class="presence-presence">
    <div class="presence-container">
      <img class="presence-image" :src="applicationImage" width="auto" height="auto">
      <div class="presence-info">
        <p class="presence-text" style="font-size: 15px">
          {{ presence.type === 4 ? presence.state : presence.name }}
        </p>

        <p v-if="presence.details" class="presence-text" style="font-size: 9px">
          {{ presence.details }}
        </p>
        <p class="presence-text" style="font-size: 9px">
          {{ presence.state }}
        </p>
        <p class="presence-text" style="font-size: 9px">
          Time: {{ timestamp }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
let timer = null

export default {
  props: {
    presence: {
      type: Object,
      required: true,
      default: () => { return {} }
    }
  },
  data () {
    return {
      timestamp: 0
    }
  },
  computed: {
    applicationImage () {
      if (this.presence.type === 4) {
        return `https://cdn.discordapp.com/emojis/${this.presence.emoji.id}.${this.presence.emoji.animated ? 'gif' : 'webp'}?size=128&quality=lossless`
      } else {
        if (this.presence?.assets?.large_image.startsWith('mp:external')) {
          return this.presence.assets.large_image.replace(/mp:external\/([^/]*)\/(http[s])/g, '$2:/')
        }

        return `https://cdn.discordapp.com/app-assets/${this.presence.application_id}/${this.presence.assets.large_image}.webp`
      }
    }

  },
  mounted () {
    timer = setInterval(() => {
      this.setTimestamp(new Date().getTime() - (this.presence.type === 4 ? this.presence.created_at : this.presence.timestamps.start))
    })
  },
  beforeDestroy () {
    clearInterval(timer)
  },
  methods: {
    msToTime (ms) {
      const seconds = (ms / 1000).toFixed(1)
      const minutes = (ms / (1000 * 60)).toFixed(1)
      const hours = (ms / (1000 * 60 * 60)).toFixed(1)
      const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
      if (~~seconds < 60) { return seconds + ' Sec' } else if (~~minutes < 60) { return minutes + ' Min' } else if (~~hours < 24) { return hours + ' Hrs' } else { return days + ' Days' }
    },
    setTimestamp (time) {
      this.timestamp = this.msToTime(time)
    }
  }
}
</script>

<style scoped>
.presence-presence {
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
}

.presence-container {
    display: flex;
    align-items: center;
    width: 100%;
}

.presence-image {
    width: auto;
    height: 85px;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.presence-info {
    display: flex;
    flex-direction: column;
    max-height: 80px;
}

.presence-text {
    color: white;
    margin-left: 10px;
    margin-top: 1px;
    margin-bottom: 3px;
    padding-right: 20px;
}
</style>
