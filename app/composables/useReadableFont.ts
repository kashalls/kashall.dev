export const READABLE_FONT_KEY = 'kashall-readable-font'

/**
 * Opt-in OpenDyslexic for the site's text, toggled from the Settings menu and
 * the command palette and persisted. The layout mirrors it onto <html> as the
 * `readable-font` class; an inline head script applies it before first paint.
 */
export const useReadableFont = () => {
    const enabled = useState('readable-font', () => false)
    const initialized = useState('readable-font-init', () => false)

    if (import.meta.client && !initialized.value) {
        initialized.value = true
        enabled.value = localStorage.getItem(READABLE_FONT_KEY) === 'true'
    }

    function set(value: boolean) {
        enabled.value = value
        if (import.meta.client) localStorage.setItem(READABLE_FONT_KEY, String(value))
    }

    return { enabled, set, toggle: () => set(!enabled.value) }
}
