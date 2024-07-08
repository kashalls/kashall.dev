import type { LanyardData } from '~/types/lanyard';

export const useLanyard = () => {
    const lanyard = useState<LanyardData>('lanyard')
    const socket = ref<WebSocket>()

    const { public: { userId } } = useRuntimeConfig()

    onMounted(async () => {
        if (!import.meta.browser) return;
        
        const { $lanyard } = useNuxtApp()
        socket.value = await $lanyard({
            userId,
            socket: true
        })

        socket.value.addEventListener('message', ({ data }) => {
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