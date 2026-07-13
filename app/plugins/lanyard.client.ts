import type { LanyardResponse } from '~/types/lanyard'

const enum Constants {
    apiBase = 'https://api.ok8.sh/discord/api',
    webSocketBase = 'wss://api.ok8.sh/discord/api/socket',
}

export default defineNuxtPlugin(() => {
    async function lanyard(options: { socket: true }): Promise<WebSocket>;
    async function lanyard(options: {}): Promise<LanyardResponse>;

    async function lanyard(options: { socket?: true }): Promise<WebSocket | LanyardResponse | LanyardResponse[]> {
        if (options.socket === true) {
            const supportsWebSocket = 'WebSocket' in window || 'MozWebSocket' in window
            if (supportsWebSocket === false) { throw new Error("Browser doesn't support WebSocket connections.") }
        }

        // Throw error if no options are set.
        if (!options || Object.keys(options).length === 0) {
            throw new Error('No options were provided.')
            // Throw error if userId is missing.
        } else if (options.socket === true) {
            const socket = new WebSocket(Constants.webSocketBase)
            socket.addEventListener('open', () => {
                // Send heartbeat every 30 seconds
                setInterval(() => {
                    socket.send(
                        JSON.stringify({
                            op: 3
                        })
                    )
                }, 30000)
            })

            return socket
        } else {
            const data = await fetch(`${Constants.apiBase}/users/me`).then(res =>
                res.json()
            )

            return data
        } 
    }

    return {
        provide: {
            lanyard
        }
    }
})