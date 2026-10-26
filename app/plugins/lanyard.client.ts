import type { LanyardResponse } from '~/types/lanyard'

const enum Constants {
    apiBase = 'https://api.lanyard.rest/v1',
    webSocketBase = 'wss://api.lanyard.rest/socket',
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
            let heartbeat: ReturnType<typeof setInterval> | undefined

            // Lanyard expects Initialize right after Hello. Its documented heartbeat is 30s;
            // Hello's heartbeat_interval isn't trusted as a timer duration.
            socket.addEventListener('message', ({ data }) => {
                const { op } = JSON.parse(data)
                if (op !== 1) return

                socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }))
                clearInterval(heartbeat)
                heartbeat = setInterval(() => {
                    socket.send(
                        JSON.stringify({
                            op: 3
                        })
                    )
                }, 30000)
            })
            socket.addEventListener('close', () => clearInterval(heartbeat))

            return socket
        } else {
            const data = await fetch(`${Constants.apiBase}/users/${DISCORD_USER_ID}`).then(res =>
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