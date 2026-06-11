export interface WindowMeta {
    id: string
    title: string
    icon?: string
    closed: boolean
    minimized: boolean
    x: number
    y: number
}

type SavedState = Record<string, { closed?: boolean; minimized?: boolean; x?: number; y?: number }>

const STORAGE_KEY = 'kashall-window-layout'
// Saved drag positions are offsets from each window's default CSS position, so
// they only make sense for a given default layout. Bump this whenever the
// default positions change to invalidate stale saved offsets.
const LAYOUT_VERSION = 2

/**
 * Shared registry of all desktop "windows" (panels). Tracks closed/minimized
 * state and drag position, and persists the whole layout to localStorage so a
 * refresh keeps your desktop arrangement. Panels register themselves on mount.
 */
export const useWindows = () => {
    const registry = useState<Record<string, WindowMeta>>('windows-registry', () => ({}))
    const saved = useState<SavedState>('windows-saved', () => ({}))
    const loaded = useState('windows-saved-loaded', () => false)

    function loadSaved() {
        if (!import.meta.client || loaded.value) return
        loaded.value = true
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
            // Discard saved layout from a different (or unversioned) default layout
            // so stale drag offsets can't shove windows to the wrong spots.
            saved.value = raw.version === LAYOUT_VERSION ? (raw.windows ?? {}) : {}
        } catch { /* ignore */ }
    }

    function persist() {
        if (!import.meta.client) return
        const windows: SavedState = {}
        for (const w of Object.values(registry.value)) {
            windows[w.id] = { closed: w.closed, minimized: w.minimized, x: w.x, y: w.y }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: LAYOUT_VERSION, windows }))
    }

    function register(meta: { id: string; title: string; icon?: string }) {
        loadSaved()
        if (registry.value[meta.id]) return
        const s = saved.value[meta.id] ?? {}
        registry.value[meta.id] = {
            ...meta,
            closed: s.closed ?? false,
            minimized: s.minimized ?? false,
            x: s.x ?? 0,
            y: s.y ?? 0,
        }
    }

    function close(id: string) { const w = registry.value[id]; if (w) { w.closed = true; persist() } }
    function open(id: string) { const w = registry.value[id]; if (w) { w.closed = false; persist() } }
    function setMinimized(id: string, v: boolean) { const w = registry.value[id]; if (w) { w.minimized = v; persist() } }
    function setPosition(id: string, x: number, y: number) { const w = registry.value[id]; if (w) { w.x = x; w.y = y; persist() } }

    function reset() {
        for (const w of Object.values(registry.value)) {
            w.closed = false
            w.minimized = false
            w.x = 0
            w.y = 0
        }
        persist()
    }

    const closed = computed(() => Object.values(registry.value).filter(w => w.closed))

    return { registry, register, close, open, setMinimized, setPosition, reset, closed }
}
