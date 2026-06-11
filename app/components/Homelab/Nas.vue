<script setup lang="ts">
// Live TrueNAS ("puddle") metrics via kromgo. These badge ids must exist in the
// kromgo config (see the NAS badges added to the infra repo).
const KROMGO = 'https://kromgo.ok8.sh/badges'

interface Metric { value: string; color?: string }

// `totalKey` (optional) renders a smaller " / total" after the value.
interface Tile { key: string; label: string; icon: string; totalKey?: string }
const stats: Tile[] = [
    { key: 'nas_arc_size', label: 'ARC', icon: 'i-ph-memory', totalKey: 'nas_arc_max' },
    { key: 'nas_storage_used', label: 'Used', icon: 'i-ph-database' },
    { key: 'nas_storage_free', label: 'Free', icon: 'i-ph-hard-drive' },
    { key: 'nas_disk_temp', label: 'Disk Temp', icon: 'i-ph-thermometer-simple' },
    { key: 'nas_disk_count', label: 'Disks', icon: 'i-ph-hard-drives' },
    { key: 'nas_pools_online', label: 'Pools', icon: 'i-ph-shield-check' },
]

const footer = [
    { key: 'nas_uptime', label: 'Uptime', icon: 'i-ph-clock-countdown' },
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
