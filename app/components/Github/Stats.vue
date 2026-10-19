<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

// Client-only so the prerendered page doesn't bake in stats from build time.
// No automatic retry: the polling below already retries on its own schedule.
const { data: stats, status, refresh } = useFetch('/api/github', { server: false, lazy: true, retry: false })
// Only the first load shows skeletons; background refreshes keep the old values.
const pending = computed(() => !stats.value && (status.value === 'idle' || status.value === 'pending'))
const unavailable = computed(() => !stats.value && status.value === 'error')

// The server caches stats for 10 minutes, so there's nothing new to poll for
// once they've loaded; until then, retry every 2.5 minutes.
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
    if (!stats.value) timer = setInterval(refresh, 150_000)
})
watch(stats, (value) => {
    if (value) clearInterval(timer)
})
onBeforeUnmount(() => clearInterval(timer))

// Show as many whole weeks as fit the card at a fixed cube size.
const CELL = 13
const GAP = 3
const heatmap = useTemplateRef<HTMLElement>('heatmap')
const { width } = useElementSize(heatmap)
const weeks = computed(() => {
    const fit = Math.max(1, Math.floor((width.value + GAP) / (CELL + GAP)))
    return (stats.value?.weeks ?? []).slice(-fit)
})

const items = [
    { key: 'pullRequests', monthKey: 'pullRequestsThisMonth', label: 'Pull Requests', text: 'text-violet-600 dark:text-violet-300' },
    { key: 'commits', monthKey: 'commitsThisMonth', label: 'Commits', text: 'text-green-600 dark:text-green-300' },
] as const

const levelClass = ['bg-black/5 dark:bg-white/5', 'bg-purple-200 dark:bg-purple-950', 'bg-purple-300 dark:bg-purple-800', 'bg-purple-500 dark:bg-purple-600', 'bg-purple-700 dark:bg-purple-400']

// One shared tooltip for the whole heatmap instead of one per cell.
const hovered = ref<{ text: string; left: number; top: number; align: string } | null>(null)
const dateFmt = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function onCellOver(e: PointerEvent) {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-week]')
    if (!cell) return
    const week = Number(cell.dataset.week)
    const day = weeks.value[week]?.[Number(cell.dataset.day)]
    if (!day) return
    const count = weeks.value.length
    hovered.value = {
        text: `${day.count} contribution${day.count === 1 ? '' : 's'} · ${dateFmt.format(new Date(day.date))}`,
        left: cell.offsetLeft + cell.offsetWidth / 2,
        top: cell.offsetTop,
        // Edge columns anchor the tooltip inward so the panel doesn't clip it.
        align: week < 4 ? '-translate-x-3' : week >= count - 4 ? '-translate-x-[calc(100%-0.75rem)]' : '-translate-x-1/2',
    }
}

const otherPercent = computed(() =>
    Math.max(0, 100 - (stats.value?.languages ?? []).reduce((sum, l) => sum + l.percent, 0)),
)

const fmt = (n?: number) =>
    n == null ? '—' : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
</script>

<template>
    <div v-if="unavailable" class="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted">
        <UIcon name="i-ph-github-logo" class="size-6 text-dimmed" />
        GitHub stats are temporarily unavailable.
    </div>
    <div v-else class="flex flex-col gap-4">
        <div ref="heatmap">
            <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-highlighted">
                    {{ weeks.length ? `Last ${weeks.length} weeks` : 'Activity' }}
                </p>
                <p v-if="stats?.streak" class="flex items-center gap-1 text-xs text-muted">
                    <UIcon name="i-ph-fire" class="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                    <span class="font-semibold text-highlighted">{{ stats.streak }}-day</span> streak
                </p>
            </div>
            <div v-if="pending" class="mt-2 h-[109px] w-full animate-pulse rounded-md bg-black/5 dark:bg-white/5" />
            <div v-else class="relative mt-2 grid grid-flow-col grid-rows-7 gap-[3px]"
                :style="{ gridTemplateColumns: `repeat(${weeks.length}, ${CELL}px)` }"
                @pointerover="onCellOver" @pointerleave="hovered = null">
                <template v-for="(week, w) in weeks" :key="w">
                    <div v-for="(day, d) in week" :key="day.date" :data-week="w" :data-day="d"
                        class="size-[13px] rounded-[3px] hover:ring-1 hover:ring-black/40 dark:hover:ring-white/60"
                        :class="levelClass[day.level]" />
                </template>
                <div v-if="hovered"
                    class="pointer-events-none absolute z-10 -translate-y-full whitespace-nowrap rounded-md border border-default bg-default px-2 py-1 text-xs text-default shadow-lg"
                    :class="hovered.align" :style="{ left: `${hovered.left}px`, top: `${hovered.top - 6}px` }">
                    {{ hovered.text }}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
            <div v-for="item in items" :key="item.key"
                class="flex flex-col gap-1 rounded-lg border border-default bg-white/60 dark:bg-zinc-900/60 px-3 py-2.5">
                <p class="text-2xl font-bold leading-none text-highlighted">
                    <span v-if="pending" class="inline-block h-6 w-12 animate-pulse rounded-md bg-black/10 dark:bg-white/10 align-middle" />
                    <template v-else>{{ fmt(stats?.[item.key]) }}</template>
                </p>
                <p class="text-xs font-medium" :class="item.text">{{ item.label }}</p>
                <p class="text-xs" :class="stats?.[item.monthKey] ? 'text-green-600 dark:text-green-400' : 'text-dimmed'">
                    <template v-if="stats">+{{ stats[item.monthKey] }} this month</template>
                    <span v-else class="inline-block h-3 w-16 animate-pulse rounded-md bg-black/10 dark:bg-white/10 align-middle" />
                </p>
            </div>
        </div>

        <div>
            <p class="text-xs font-semibold text-highlighted">Languages</p>
            <div class="mt-2 flex h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/5" :class="pending && 'animate-pulse'">
                <span v-for="lang in stats?.languages" :key="lang.name"
                    :style="{ width: `${lang.percent}%`, backgroundColor: lang.color ?? '#64748b' }" />
                <span v-if="stats" class="bg-slate-600" :style="{ width: `${otherPercent}%` }" />
            </div>
            <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-toned">
                <span v-for="lang in stats?.languages" :key="lang.name" class="flex items-center gap-1">
                    <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: lang.color ?? '#64748b' }" />
                    {{ lang.name }} <span class="text-dimmed">{{ Math.round(lang.percent) }}%</span>
                </span>
            </div>
        </div>
    </div>
</template>
