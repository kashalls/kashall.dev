<script setup lang="ts">
// kromgo sends CORS headers, so we fetch the live cluster metrics straight from
// the browser (no server proxy needed) and refresh them on an interval.
const KROMGO = 'https://kromgo.ok8.sh/badges'

interface Metric { value: string; color?: string }

// Grid tiles, grouped: size · compute · network · status.
// `totalKey` (optional) renders a smaller " / total" after the value.
interface Tile { key: string; label: string; icon: string; totalKey?: string }
const stats: Tile[] = [
    { key: 'cluster_node_count', label: 'Nodes', icon: 'i-ph-hard-drives' },
    { key: 'cluster_pods_running', label: 'Pods', icon: 'i-ph-shipping-container' },
    { key: 'cluster_cpu_usage', label: 'CPU', icon: 'i-ph-cpu' },
    { key: 'node_memory_used', label: 'Memory', icon: 'i-ph-memory', totalKey: 'node_memory_total' },
    { key: 'cluster_network_transmit_usage', label: 'Transmit', icon: 'i-ph-arrow-up' },
    { key: 'cluster_network_receive_usage', label: 'Receive', icon: 'i-ph-arrow-down' },
    { key: 'cluster_power_usage', label: 'Power', icon: 'i-ph-lightning' },
    { key: 'prometheus_active_alerts', label: 'Alerts', icon: 'i-ph-warning' },
]

const footer = [
    { key: 'talos_version', label: 'Talos', icon: 'i-simple-icons-talos' },
    { key: 'kubernetes_version', label: 'Kubernetes', icon: 'i-simple-icons-kubernetes' },
    { key: 'cluster_uptime_age', label: 'Uptime', icon: 'i-ph-clock-countdown' },
] as const

const data = ref<Record<string, Metric>>({})
const pending = ref(true)

const colorClass = (c?: string) => (({
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    yellow: 'text-yellow-300',
    blue: 'text-blue-400',
} as Record<string, string>)[c ?? ''] ?? 'text-white')

async function load() {
    const keys = [
        ...stats.flatMap(s => s.totalKey ? [s.key, s.totalKey] : [s.key]),
        ...footer.map(s => s.key),
    ]
    const results = await Promise.all(
        keys.map(k => $fetch<Metric>(`${KROMGO}/${k}?format=json`).catch(() => null)),
    )
    keys.forEach((k, i) => { if (results[i]) data.value[k] = results[i]! })
    pending.value = false
}

let timer: ReturnType<typeof setInterval>
onMounted(() => {
    load()
    timer = setInterval(load, 30_000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
            <div v-for="s in stats" :key="s.key"
                class="flex flex-col gap-1 rounded-lg border border-gray-800 bg-zinc-900/60 p-2.5">
                <div class="flex items-center gap-1 text-[0.7rem] text-slate-400">
                    <UIcon :name="s.icon" class="h-3.5 w-3.5" /> {{ s.label }}
                </div>
                <p class="text-base font-bold leading-none" :class="colorClass(data[s.key]?.color)">
                    <span v-if="pending" class="inline-block h-4 w-8 animate-pulse rounded bg-white/10 align-middle" />
                    <template v-else>{{ data[s.key]?.value ?? '—' }}<span v-if="s.totalKey && data[s.totalKey]"
                            class="text-[0.6rem] font-normal text-slate-500"> / {{ data[s.totalKey]?.value }}</span></template>
                </p>
            </div>
        </div>

        <div class="flex flex-col gap-1.5 rounded-lg border border-gray-800 bg-zinc-900/60 p-2.5">
            <div v-for="f in footer" :key="f.key" class="flex items-center gap-2 text-xs">
                <UIcon :name="f.icon" class="h-4 w-4 text-primary-400" />
                <span class="text-slate-400">{{ f.label }}</span>
                <span class="ml-auto font-mono font-medium text-white">
                    <span v-if="pending" class="inline-block h-3 w-12 animate-pulse rounded bg-white/10 align-middle" />
                    <template v-else>{{ data[f.key]?.value ?? '—' }}</template>
                </span>
            </div>
        </div>
    </div>
</template>
