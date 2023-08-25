<template>
  <div class="rounded-xl w-full items-center h-24 flex flex-col shadow-xl bg-gray-950">
    <div class="flex items-center w-full">
      <img class="w-auto max-h-24 cursor-pointer rounded-l-xl" :src="applicationImage" width="auto" height="auto">
      <div class="flex flex-col max-h-20">
        <p class="text-white ml-6 mt-1 mb-1 pr-8 text-xs font-semibold">
          {{ activity.name }}
        </p>

        <p class="text-white ml-6 mt-0.5 mb-0.5 pr-8" style="font-size: 9px">
          {{ activity.details }}
        </p>
        <p class="text-white ml-6 mt-1 mb-0.5 pr-8" style="font-size: 9px">
          {{ activity.state }}
        </p>
        <p class="text-white ml-6 mt-1 mb-0.5 pr-8" style="font-size: 9px">
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
.vscode-image {
    width: auto;
    height: 85px;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

</style>
