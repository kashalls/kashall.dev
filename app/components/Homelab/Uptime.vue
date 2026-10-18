<script setup lang="ts">
// Client-only so the prerendered page doesn't bake in status from build time.
const { data: services, status, refresh } = useFetch('/api/status', { server: false, lazy: true })
// Only the first load shows skeletons; background refreshes keep the old values.
const pending = computed(() => !services.value && (status.value === 'idle' || status.value === 'pending'))

let timer: ReturnType<typeof setInterval>
onMounted(() => {
    timer = setInterval(refresh, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const percent = (value: number | null) => value === null ? '—' : `${(value * 100).toFixed(value === 1 ? 0 : 2)}%`
const checkTime = (at: string) => new Date(at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
    <div class="flex flex-col gap-2">
        <template v-if="pending">
            <div v-for="i in 5" :key="i" class="h-14 animate-pulse rounded-lg border border-gray-800 bg-zinc-900/60" />
        </template>

        <p v-else-if="!services?.length" class="p-2 text-sm text-slate-400">Status is unavailable right now.</p>

        <template v-else>
            <div v-for="service in services" :key="service.key"
                class="flex flex-col gap-2 rounded-lg border border-gray-800 bg-zinc-900/60 p-2.5">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span class="size-2 shrink-0 rounded-full"
                        :class="service.up === null ? 'bg-slate-500' : service.up ? 'bg-green-400' : 'bg-red-400'" />
                    <span class="font-medium text-white">{{ service.label }}</span>
                    <span class="ml-auto flex gap-3 font-mono text-slate-400">
                        <span v-for="(value, duration) in service.uptime" :key="duration">
                            <span class="text-slate-500">{{ duration }}</span> {{ percent(value) }}
                        </span>
                    </span>
                </div>
                <div class="flex h-5 gap-px" :aria-label="`${service.label}: last ${service.checks.length} checks`">
                    <span v-for="check in service.checks" :key="check.at" class="flex-1 rounded-[1px]"
                        :class="check.ok ? 'bg-green-500/70' : 'bg-red-500'"
                        :title="`${checkTime(check.at)} · ${check.ok ? 'up' : 'down'}`" />
                </div>
            </div>
        </template>

        <div class="flex items-center justify-between gap-2">
            <p class="text-xs text-slate-500">Bars are the last 100 checks, oldest on the left.</p>
            <UButton to="https://status.ok8.sh" target="_blank" label="Full status page"
                trailing-icon="i-ph-arrow-right" color="neutral" variant="link" size="xs" />
        </div>
    </div>
</template>
