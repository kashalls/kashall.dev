<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="presence.activities && presence.discord_status !== 'offline'" class="presence">
    <VSCode v-if="!!vscode" :activity="vscode" />
    <Spotify v-else-if="presence.listening_to_spotify" :track="presence.spotify" />
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

<style scoped>
.presence-presence {
    border-radius: 10px;
    width: 100%;
    height: 85px;
    background-color: #34344F;
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

.presence-info {
    display: flex;
    flex-direction: column;
    max-height: 80px;
}

.presence-text {
    color: var(--text,#000000);
    margin-left: 10px;
    margin-top: 1px;
    margin-bottom: 3px;
    padding-right: 20px;
}
</style>
