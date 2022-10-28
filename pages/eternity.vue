<template>
  <section class="section is-align-content-center">
    <div class="columns is-centered">
      <div class="column has-text-centered is-half">
        <h1 class="title is-1 has-text-white">
          Kashall
        </h1>
        <div class="block">
          <h2 class="title is-3 has-text-link">
            <span class="has-text-info">ᛃ {{ getBalance.toLocaleString('en-US') }}</span> / <span class="has-text-success">ᛃ {{ totalEther.toLocaleString('en-US') }}</span>
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const uuid = '3491fc09-13ba-4624-b3cc-da8e87f0230f'

export default {
  data () {
    return {
      user: null,
      totalEther: 0,
      socket: null,
      socketHeartbeat: null,
      etherTimer: null
    }
  },
  computed: {
    getBalance () {
      return this.user?.balance || 0
    }
  },
  mounted () {
    const supportsWebSocket = 'WebSocket' in window || 'MozWebSocket' in window
    if (!supportsWebSocket) {
      throw new Error("Browser doesn't support Websocket connections.")
    }
    this.socket = new WebSocket('wss://api.kashall.dev/socket')
    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_uuids: [uuid]
        }
      }))
    })
    this.socket.addEventListener('message', ({ data }) => {
      data = JSON.parse(data)
      if (data.op === 1) {
        if (this.socketHeartbeat) {
          return
        }
        this.socketHeartbeat = setInterval(() => {
          this.socket.send(JSON.stringify({
            op: 3
          }))
        }, 30000)
      } else if (data.op === 0) {
        this.user = data.d[uuid]
      }
    })

    this.getTotalEther()
    this.etherTimer = setInterval(() => {
      this.getTotalEther()
    }, 30000)
  },
  beforeDestroy () {
    clearInterval(this.etherTimer)
    clearInterval(this.timer)
    this.socket?.close()
  },
  methods: {
    getTotalEther () {
      this.$axios.$get('https://api.eternal.gs/economy/stats')
        .then((data) => {
          this.totalEther = parseInt(data?.ether?.total)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
