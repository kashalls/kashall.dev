<template>
  <div class="vscode-presence">
    <div class="vscode-container">
      <img class="vscode-image" :src="applicationImage" width="auto" height="auto">
      <div class="vscode-info">
        <p class="vscode-text" style="font-size: 12px">
          {{ activity.name }}
        </p>

        <p class="vscode-text" style="font-size: 9px">
          {{ activity.details }}
        </p>
        <p class="vscode-text" style="font-size: 9px">
          {{ activity.state }}
        </p>
        <p class="vscode-text" style="font-size: 9px">
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
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      timestamp: 0
    }
  },
  computed: {
    applicationImage () {
      if (!this.activity.assets) { return }
      if (this.activity.assets.large_image.startsWith('mp:external')) {
        return this.activity.assets.large_image.replace(/mp:external\/([^/]*)\/(http[s])/g, '$2:/')
      }

      return `https://cdn.discordapp.com/app-assets/${this.activity.application_id}/${this.activity.assets.large_image}.webp`
    }
  },
  mounted () {
    timer = setInterval(() => {
      this.setTimestamp(new Date().getTime() - this.activity.timestamps.start)
    })
    console.log(this.activity)
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
.vscode-presence {
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

.vscode-container {
    display: flex;
    align-items: center;
    width: 100%;
}

.vscode-image {
    width: auto;
    height: 85px;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.vscode-info {
    display: flex;
    flex-direction: column;
    max-height: 80px;
}

.vscode-text {
    color: white;
    margin-left: 10px;
    margin-top: 1px;
    margin-bottom: 3px;
    padding-right: 20px;
}
</style>
