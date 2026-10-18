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
        <div v-if="pending" class="flex flex-col gap-1.5">
            <div v-for="i in 5" :key="i" class="h-6 animate-pulse rounded bg-white/5" />
        </div>

        <p v-else-if="!services?.length" class="p-2 text-sm text-slate-400">Status is unavailable right now.</p>

        <ul v-else class="divide-y divide-gray-900">
            <!-- One line per service from sm up; on phones the check strip wraps below. -->
            <li v-for="service in services" :key="service.key"
                class="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-xs sm:flex-nowrap">
                <span class="flex w-32 shrink-0 items-center gap-2">
                    <span class="size-2 shrink-0 rounded-full"
                        :class="service.up === null ? 'bg-slate-500' : service.up ? 'bg-green-400' : 'bg-red-400'" />
                    <span class="truncate font-medium text-white">{{ service.label }}</span>
                </span>
                <span class="order-last flex h-3 w-full gap-px sm:order-none sm:w-auto sm:flex-1"
                    :aria-label="`${service.label}: last ${service.checks.length} checks`">
                    <span v-for="check in service.checks" :key="check.at" class="flex-1 rounded-[1px]"
                        :class="check.ok ? 'bg-green-500/70' : 'bg-red-500'"
                        :title="`${checkTime(check.at)} · ${check.ok ? 'up' : 'down'}`" />
                </span>
                <!-- Fixed width keeps the strips aligned when a value is a short "100%";
                     phones only show 30d. -->
                <span class="ml-auto flex shrink-0 justify-end gap-3 font-mono text-slate-400 sm:ml-0 sm:w-56">
                    <span v-for="(value, duration) in service.uptime" :key="duration"
                        :class="duration !== '30d' && 'hidden sm:inline'">
                        <span class="text-slate-500">{{ duration }}</span> {{ percent(value) }}
                    </span>
                </span>
            </li>
        </ul>

        <div class="flex items-center justify-between gap-2">
            <p class="text-xs text-slate-500">Last 100 checks per service, oldest on the left.</p>
            <UButton to="https://status.ok8.sh" target="_blank" label="Full status page"
                trailing-icon="i-ph-arrow-right" color="neutral" variant="link" size="xs" />
        </div>
    </div>
</template>
