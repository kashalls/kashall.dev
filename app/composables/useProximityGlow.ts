/**
 * Feeds the mouse position to every `.glow-card` as card-relative CSS
 * variables, so each card's border glow (see main.css) lights up as the
 * cursor gets near it, not only while hovering it.
 */
export const useProximityGlow = () => {
    let frame = 0
    let x = 0
    let y = 0

    function paint() {
        frame = 0
        for (const el of document.querySelectorAll<HTMLElement>('.glow-card')) {
            const rect = el.getBoundingClientRect()
            el.style.setProperty('--glow-x', `${x - rect.left}px`)
            el.style.setProperty('--glow-y', `${y - rect.top}px`)
        }
    }

    function onMove(e: PointerEvent) {
        if (e.pointerType !== 'mouse') return
        x = e.clientX
        y = e.clientY
        if (!frame) frame = requestAnimationFrame(paint)
    }

    // Park the glow off-screen when the cursor leaves the window.
    function onLeave() {
        x = -9999
        y = -9999
        if (!frame) frame = requestAnimationFrame(paint)
    }

    onMounted(() => {
        window.addEventListener('pointermove', onMove, { passive: true })
        // Scrolling moves the cards under a stationary cursor.
        window.addEventListener('scroll', paint, { passive: true, capture: true })
        document.documentElement.addEventListener('pointerleave', onLeave)
    })

    onUnmounted(() => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('scroll', paint, { capture: true })
        document.documentElement.removeEventListener('pointerleave', onLeave)
        cancelAnimationFrame(frame)
    })
}
