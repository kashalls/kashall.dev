/** Applies the visitor's motion, font and text size choices to the page. */
export const useDisplayPreferences = () => {
    const { reduced } = useMotionPreference()
    const { enabled: readableFont } = useReadableFont()
    const { size: textSize } = useTextSize()
    if (import.meta.client) {
        watchEffect(() => document.documentElement.classList.toggle('reduce-motion', reduced.value))
        watchEffect(() => document.documentElement.classList.toggle('readable-font', readableFont.value))
        watchEffect(() => { document.documentElement.dataset.textSize = textSize.value })
    }

    // Pages are prerendered, so apply the saved font and text size before first
    // paint instead of swapping them once the app hydrates.
    useHead({
        script: [{
            innerHTML: `try{if(localStorage.getItem('${READABLE_FONT_KEY}')==='true')document.documentElement.classList.add('readable-font');var s=localStorage.getItem('${TEXT_SIZE_KEY}');if(s)document.documentElement.dataset.textSize=s}catch(e){}`,
        }],
    })
}
