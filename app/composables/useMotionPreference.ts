const STORAGE_KEY = 'kashall-reduce-motion'

/**
 * Reduced-motion preference: starts from the OS setting, overridable via the
 * Settings menu and persisted. Consumed by Lenis (smoothing), the reset tween,
 * and a global CSS class that neutralises transitions/animations.
 *
 * Named `useMotionPreference` to avoid colliding with @vueuse/motion's
 * auto-imported `useReducedMotion`.
 */
export const useMotionPreference = () => {
    const reduced = useState('reduce-motion', () => false)
    const initialized = useState('reduce-motion-init', () => false)

    function init() {
        if (!import.meta.client || initialized.value) return
        initialized.value = true
        const saved = localStorage.getItem(STORAGE_KEY)
        reduced.value = saved !== null
            ? saved === 'true'
            : window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    function set(value: boolean) {
        reduced.value = value
        if (import.meta.client) localStorage.setItem(STORAGE_KEY, String(value))
    }

    if (import.meta.client) init()

    return { reduced, set, toggle: () => set(!reduced.value) }
}
