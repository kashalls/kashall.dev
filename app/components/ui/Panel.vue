<template>
    <!-- When maximized the window is teleported to the body so it can cover the
         whole workspace without being clipped by the draggable transforms. -->
    <Teleport to="body" :disabled="!maximized">
        <div v-show="!isClosed" ref="panel" :class="cn(
            'group/window flex flex-col border border-gray-900 rounded overflow-hidden bg-gradient-to-tr from-[#0e0c12]/75 to-[#0e0f0f]/25 backdrop-blur-3xl transition-[box-shadow,border-color] duration-300',
            maximized
                ? 'fixed inset-3 md:inset-6 z-[60] !h-auto max-h-[calc(100dvh-1.5rem)] border-primary-700/50 shadow-2xl shadow-primary-950/60'
                : 'h-full hover:border-primary-800/50 hover:shadow-lg hover:shadow-primary-950/40'
        )">
            <div class="flex min-h-10 h-10 shrink-0 items-center gap-4 border-b border-gray-900 text-neutral cursor-default select-none"
                @dblclick="toggleMaximize">
                <p class="flex items-center gap-2 font-body text-sm font-normal tracking-normal text-neutral-50 px-4 truncate">
                    <UIcon v-if="props.icon" :name="props.icon" class="h-4 w-4 text-primary-400 shrink-0" />
                    {{ props.title }}
                </p>
                <div class="flex ml-auto gap-1 pr-1" @dblclick.stop>
                    <UButton :icon="minimized ? 'i-ph-plus' : 'i-ph-minus'" :aria-label="minimized ? 'Restore' : 'Minimize'"
                        size="xs" color="primary" variant="ghost" class="hover:!bg-primary-500/20"
                        @click="toggleMinimize" />
                    <UButton :icon="maximized ? 'i-ph-corners-in' : 'i-ph-square'"
                        :aria-label="maximized ? 'Restore' : 'Maximize'" size="xs" color="primary" variant="ghost"
                        class="hover:!bg-primary-500/20" @click="toggleMaximize" />
                    <UButton icon="i-ph-x" aria-label="Close" size="xs" color="primary" variant="ghost"
                        class="hover:!bg-red-500/80 hover:!text-white" @click="closeWindow" />
                </div>
            </div>
            <div v-show="!minimized"
                :class="cn(props.padded && 'p-4', maximized && 'flex-1 overflow-y-auto')">
                <slot />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: undefined
    },
    padded: {
        type: Boolean,
        default: true
    },
    // Whether closing sends the window to the restore dock. Transient windows
    // (e.g. live Discord activity cards) set this to false so they just dismiss.
    dock: {
        type: Boolean,
        default: true
    }
})

const { register, close, setMinimized, registry } = useWindows()

const id = computed(() => props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))

const maximized = ref(false)
const localMinimized = ref(false)
const localClosed = ref(false)

// Docked windows persist their state via the registry; transient ones stay local.
const minimized = computed({
    get: () => props.dock ? (registry.value[id.value]?.minimized ?? false) : localMinimized.value,
    set: (v) => props.dock ? setMinimized(id.value, v) : (localMinimized.value = v),
})

const isClosed = computed(() => props.dock ? (registry.value[id.value]?.closed ?? false) : localClosed.value)

function toggleMinimize() {
    minimized.value = !minimized.value
    if (minimized.value) maximized.value = false
}

function toggleMaximize() {
    maximized.value = !maximized.value
    if (maximized.value) minimized.value = false
}

function closeWindow() {
    maximized.value = false
    minimized.value = false
    if (props.dock) close(id.value)
    else localClosed.value = true
}

// Esc restores a maximized window.
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && maximized.value) toggleMaximize()
}
watch(maximized, (v) => {
    if (!import.meta.client) return
    if (v) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
})

onMounted(() => {
    if (props.dock) register({ id: id.value, title: props.title, icon: props.icon })
})

onUnmounted(() => {
    if (import.meta.client) window.removeEventListener('keydown', onKeydown)
})
</script>
