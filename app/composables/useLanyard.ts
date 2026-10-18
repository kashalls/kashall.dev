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
            const { d } = JSON.parse(data)
            if (!d.heartbeat_interval) {
                lanyard.value = d
            }
        })
    })

    onUnmounted(() => {
        socket.value?.close()
    })

    return lanyard
}