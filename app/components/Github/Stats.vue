<script setup lang="ts">
// Client-only so the prerendered page doesn't bake in stats from build time.
const { data: stats, status, refresh } = useFetch('/api/github', { server: false, lazy: true })
// Only the first load shows skeletons; background refreshes keep the old values.
const pending = computed(() => !stats.value && (status.value === 'idle' || status.value === 'pending'))

let timer: ReturnType<typeof setInterval>
onMounted(() => {
    timer = setInterval(refresh, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const items = [
    { key: 'pullRequests', monthKey: 'pullRequestsThisMonth', label: 'Pull Requests', text: 'text-violet-300' },
    { key: 'issues', monthKey: 'issuesThisMonth', label: 'Issues', text: 'text-green-300' },
] as const

const levelClass = ['bg-white/5', 'bg-purple-950', 'bg-purple-800', 'bg-purple-600', 'bg-purple-400']

const otherPercent = computed(() =>
    Math.max(0, 100 - (stats.value?.languages ?? []).reduce((sum, l) => sum + l.percent, 0)),
)

const fmt = (n?: number) =>
    n == null ? '—' : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            <div class="flex items-center justify-between">
                <p class="text-[0.7rem] font-semibold uppercase tracking-widest text-slate-500">Last 18 weeks</p>
                <p v-if="stats?.streak" class="flex items-center gap-1 text-xs text-slate-400">
                    <UIcon name="i-ph-fire-fill" class="h-3.5 w-3.5 text-orange-400" />
                    <span class="font-semibold text-white">{{ stats.streak }}-day</span> streak
                </p>
            </div>
            <div v-if="pending" class="mt-2 aspect-[18/7] w-full animate-pulse rounded bg-white/5" />
            <div v-else class="mt-2 grid grid-flow-col grid-cols-18 grid-rows-7 gap-[3px]">
                <template v-for="(week, w) in stats?.weeks" :key="w">
                    <div v-for="day in week" :key="day.date" class="aspect-square rounded-[3px]"
                        :class="levelClass[day.level]" :title="`${day.count} contributions on ${day.date}`" />
                </template>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
            <div v-for="item in items" :key="item.key"
                class="flex flex-col gap-1 rounded-lg border border-gray-800 bg-zinc-900/60 px-3 py-2.5">
                <p class="text-2xl font-bold leading-none text-white">
                    <span v-if="pending" class="inline-block h-6 w-12 animate-pulse rounded bg-white/10 align-middle" />
                    <template v-else>{{ fmt(stats?.[item.key]) }}</template>
                </p>
                <p class="text-xs font-medium" :class="item.text">{{ item.label }}</p>
                <p class="text-xs" :class="stats?.[item.monthKey] ? 'text-green-400' : 'text-slate-500'">
                    <template v-if="stats">+{{ stats[item.monthKey] }} this month</template>
                    <span v-else class="inline-block h-3 w-16 animate-pulse rounded bg-white/10 align-middle" />
                </p>
            </div>
        </div>

        <div>
            <p class="text-[0.7rem] font-semibold uppercase tracking-widest text-slate-500">Languages</p>
            <div class="mt-2 flex h-2 overflow-hidden rounded-full bg-white/5" :class="pending && 'animate-pulse'">
                <span v-for="lang in stats?.languages" :key="lang.name"
                    :style="{ width: `${lang.percent}%`, backgroundColor: lang.color ?? '#64748b' }" />
                <span v-if="stats" class="bg-slate-600" :style="{ width: `${otherPercent}%` }" />
            </div>
            <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300">
                <span v-for="lang in stats?.languages" :key="lang.name" class="flex items-center gap-1">
                    <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: lang.color ?? '#64748b' }" />
                    {{ lang.name }} <span class="text-slate-500">{{ Math.round(lang.percent) }}%</span>
                </span>
            </div>
        </div>
    </div>
</template>
