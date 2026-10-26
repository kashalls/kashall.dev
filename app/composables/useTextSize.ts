export const TEXT_SIZE_KEY = 'kashall-text-size'

// Root font sizes. Everything is sized in rem, so this scales the whole site.
export const TEXT_SIZES = [
    { value: 'sm', label: 'Small', percent: 87.5 },
    { value: 'md', label: 'Default', percent: 100 },
    { value: 'lg', label: 'Large', percent: 112.5 },
    { value: 'xl', label: 'Larger', percent: 125 },
] as const

export type TextSize = typeof TEXT_SIZES[number]['value']

/**
 * Site-wide text size, chosen in the Display menu and persisted. The layout
 * mirrors it onto <html> as `data-text-size`; an inline head script applies it
 * before first paint.
 */
export const useTextSize = () => {
    const size = useState<TextSize>('text-size', () => 'md')
    const initialized = useState('text-size-init', () => false)

    if (import.meta.client && !initialized.value) {
        initialized.value = true
        const saved = localStorage.getItem(TEXT_SIZE_KEY)
        if (TEXT_SIZES.some(option => option.value === saved)) size.value = saved as TextSize
    }

    function set(value: TextSize) {
        size.value = value
        if (import.meta.client) localStorage.setItem(TEXT_SIZE_KEY, value)
    }

    return { size, set }
}
