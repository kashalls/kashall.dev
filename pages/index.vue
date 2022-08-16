<template>
  <section class="section is-align-content-center is-align-items-center is-justify-content-center is-centered is-large">
    <div class="columns is-mobile is-flex">
      <div class="column">
        <div class="is-flex is-flex-direction-row is-align-items-center">
          <h1 class="title is-1 has-text-white is-inline-block">
            Jordan Jones
          </h1>
          <span class="ml-4 is-flex">
            <template v-if="lanyard">
              <b-tooltip position="is-right" type="is-dark">
                <svg height="40" width="24" class="is-inline-block">
                  <template v-if="!lanyard.active_on_discord_mobile">
                    <rect
                      width="24"
                      height="24"
                      x="0"
                      y="0"
                      :fill="StatusMap[status]"
                      :mask="'url(#svg-mask-status-' + lanyard.discord_status + ')'"
                    />
                  </template>
                  <template v-if="lanyard.active_on_discord_mobile && status === 'online'">
                    <rect
                      width="24"
                      height="36"
                      x="0"
                      y="0"
                      :fill="StatusMap[status]"
                      mask="url(#svg-mask-status-mobile)"
                    />
                  </template>
                </svg>

                <template #content>
                  <template v-if="status === 'dnd'">
                    Do Not Disturb
                  </template>
                  <template v-else-if="status === 'online' && lanyard.active_on_discord_mobile">
                    Active On Mobile
                  </template>
                  <template v-else>
                    {{ status.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) }}
                  </template>
                </template>
              </b-tooltip>
            </template>
          </span>
        </div>
        <p class="has-text-primary">
          I'm a ~{{ getAge().toPrecision(7) }} year old self-taught web developer in the United States.
        </p>
      </div>
    </div>
    <status-mask />
  </section>
</template>

<script>
import StatusMask from '~/components/StatusMask.vue'
const StatusMap = {
  dnd: 'hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)',
  online: 'hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)',
  idle: 'hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%)',
  offline: 'hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)'
}

export default {
  name: 'IndexPage',
  components: { StatusMask },
  data () {
    return {
      lanyard: { discord_status: 'offline' },
      lanyardSocket: null,
      userId: '201077739589992448',
      status: 'offline',
      pfp: '',
      StatusMap
    }
  },
  computed: {
    discordAvatar () {
      return `https://cdn.discordapp.com/avatars/${this.userId}/`
    }
  },
  watch: {
    'lanyard.discord_status': {
      handler (val) {
        if (!val) { return }
        this.status = val
      },
      deep: true
    },
    'lanyard.discord_user.avatar': {
      handler (val) {
        if (!val) { return }
        let avatar = val.substring(2)
        if (val.startsWith('a_')) {
          avatar = `${avatar}.gif`
        } else {
          avatar = `${avatar}.webp`
        }
        this.pfp = avatar
      },
      deep: true
    }
  },
  async mounted () {
    this.lanyardSocket = await this.$lanyard({
      userId: this.userId,
      socket: true
    })
    this.lanyardSocket.addEventListener('message', ({ data }) => {
      const { d: status } = JSON.parse(data)
      this.lanyard = status
    })
  },
  beforeDestroy () {
    this.lanyardSocket?.close()
  },
  methods: {
    getAge () {
      const bDay = new Date(2000, 6, 24, 2)
      const ageMilliseconds = Date.now() - bDay.getTime()
      return ageMilliseconds / 31536000000
    }
  }
}
</script>
