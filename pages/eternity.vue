<template>
  <section class="section is-align-content-center" />
</template>

<script>
const uuid = '3491fc09-13ba-4624-b3cc-da8e87f0230f'

export default {
  data () {
    return {
      user: null,
      socket: null,
      timer: null
    }
  },
  mounted () {
    const supportsWebSocket = 'WebSocket' in window || 'MozWebSocket' in window
    if (!supportsWebSocket) { throw new Error('Browser doesn\'t support Websocket connections.') }

    this.socket = new WebSocket('wss://api.kashall.dev/socket')

    this.socket.addEventListener('open', () => {
      this.socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_uuids: [uuid]
          }
        })
      )

      setInterval(() => {
        this.socket.send(
          JSON.stringify({
            op: 3
          })
        )
      }, 30000)
    })

    this.socket.addEventListener('message', ({ data }) => {
      data = JSON.parse(data)

      if (data.op === 1) {
        if (this.timer) { return }
        this.timer = setInterval(() => {
          this.socket.send(
            JSON.stringify({
              op: 3
            })
          )
        }, 30000)
      } else if (data.op === 0) {
        this.user = data.d[uuid]
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.socket?.close()
  }
}
</script>
