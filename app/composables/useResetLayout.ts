/**
 * Lightweight signal so a button anywhere (e.g. the footer) can ask the page
 * that owns the draggable windows to reset them to their starting positions.
 */
export const useResetLayout = () => {
    const signal = useState('reset-layout-signal', () => 0)
    const reset = () => signal.value++
    return { signal, reset }
}
