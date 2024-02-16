export default defineNuxtPlugin(async (nuxt) => {
    const { io } = await import('socket.io-client')
    const socket = io()

    nuxt.provide('socket', socket)
    nuxt.provide('io', io)
})

declare module '#app' {
    interface NuxtApp {
      $io: typeof import('socket.io-client')['io']
      $socket: ReturnType<typeof import('socket.io-client')['io']>
    }
  }