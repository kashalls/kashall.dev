import type { LanyardResponse } from '~/types/lanyard'

const enum Constants {
    apiBase = 'https://api.lanyard.rest/v1',
    webSocketBase = 'wss://api.lanyard.rest/socket',
}

export default defineNuxtPlugin(() => {
    async function lanyard(options: { userId: string | string[], socket: true }): Promise<WebSocket>;
    async function lanyard(options: { userId: string }): Promise<LanyardResponse>;
    async function lanyard(options: { userId: string[] }): Promise<LanyardResponse[]>;

    async function lanyard(options: { userId: string | string[], socket?: true }): Promise<WebSocket | LanyardResponse | LanyardResponse[]> {
        if (options.socket === true) {
            const supportsWebSocket = 'WebSocket' in window || 'MozWebSocket' in window
            if (supportsWebSocket === false) { throw new Error("Browser doesn't support WebSocket connections.") }
        }

        // Throw error if no options are set.
        if (!options || Object.keys(options).length === 0) {
            throw new Error('No options were provided.')
            // Throw error if userId is missing.
        } else if (options.userId === undefined) {
            throw new Error('Missing `userId` option.')
            // Use websocket if socket option is set to true.
        } else if (options.socket === true) {
            const socket = new WebSocket(Constants.webSocketBase)

            let key = 'subscribe_to_id'
            if (typeof options.userId === 'object') { key = 'subscribe_to_ids' }

            socket.addEventListener('open', () => {
                // Subscribe to ID(s)
                socket.send(
                    JSON.stringify({
                        op: 2,
                        d: {
                            [key]: options.userId
                        }
                    })
                )

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
            // Send a single request if userId is a string
        } else if (typeof options.userId === 'string') {
            const data = await fetch(`${Constants.apiBase}/users/${options.userId}`).then(res =>
                res.json()
            )

            return data
            // Send multiple request if userId is a string
        } else if (typeof options.userId === 'object') {
            const responseArray = []

            for (const user of options.userId) {
                const data = await fetch(`${Constants.apiBase}/users/${user}`).then(res =>
                    res.json()
                )

                responseArray.push(data)
            }

            return responseArray
        }

        throw new Error('Unreachable')
    }

    return {
        provide: {
            lanyard
        }
    }
})