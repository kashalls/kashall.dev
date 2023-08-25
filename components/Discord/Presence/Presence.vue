<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    v-if="presence.activities && presence.discord_status !== 'offline'"
    class="flex flex-row w-full justify-around gap-5">
    <Spotify v-if="presence.listening_to_spotify" :track="presence.spotify" />
    <VSCode v-if="!!vscode" :activity="vscode" />
    <PresenceBase v-else-if="amIDoingAnything" :presence="anything" />
  </div>
</template>

<script>
import Spotify from './Spotify'
import VSCode from './VSCode'
import PresenceBase from './Base'

export default {
  components: { Spotify, VSCode, PresenceBase },
  props: {
    presence: {
      type: Object,
      default: () => {
        return { }
      }
    }
  },
  data () {
    return {
      vscode: null,
      overwatch: null,
      anything: null
    }
  },
  computed: {
    amIDoingAnything () {
      return Boolean(this.presence.activities.filter(activity => activity.type !== 4))
    },
    spotify () {
      return this.presence.spotify
    }
  },
  watch: {
    'presence.activities': {
      handler (activities) {
        if (!activities) { return }
        const vscode = activities.find(activity => activity.application_id === '383226320970055681')
        const overwatch = activities.find(activity => activity.application_id === '356875221078245376')
        const anything = activities.find(activity => activity.type === 0) || activities.find(activity => activity.type === 4)

        this.vscode = vscode
        this.overwatch = overwatch
        this.anything = anything
      },
      deep: true
    }
  }
}
</script>
