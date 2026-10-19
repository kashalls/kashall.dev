import type { RouterConfig } from '@nuxt/schema'

// Pages scroll inside the layout's #content-frame, not the window, so the
// router's default scrolling (which moves the window) has no effect.
export default <RouterConfig>{
    scrollBehavior(to, from) {
        const scroll = () => {
            const target = to.hash && document.getElementById(decodeURIComponent(to.hash.slice(1)))
            if (target) target.scrollIntoView({ block: 'start' })
            else if (to.path !== from.path) document.getElementById('content-frame')?.scrollTo({ top: 0 })
        }
        if (to.path === from.path) scroll()
        else useNuxtApp().hooks.hookOnce('page:finish', () => {
            requestAnimationFrame(scroll)
        })
        return false
    },
}
