import type { LanyardData } from '~/types/lanyard';

export const useLanyard = () => {
    const lanyard = useState<LanyardData>('lanyard')
    const socket = ref<WebSocket>()

    onMounted(async () => {
        if (!import.meta.browser) return;
        
        const { $lanyard } = useNuxtApp()
        const ws = await $lanyard({ socket: true })
        socket.value = ws

        ws.addEventListener('message', ({ data }) => {
            const { op, d } = JSON.parse(data)
            // Op 0 carries INIT_STATE and PRESENCE_UPDATE, both the full presence.
            if (op === 0) {
                lanyard.value = d
            }
        })
    })

    onUnmounted(() => {
        socket.value?.close()
    })

    return lanyard
}