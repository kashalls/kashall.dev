import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const useLenis = () => {
    const lenis = useState<Lenis>('lenis');
    const { reduced } = useMotionPreference()

    function create() {
        const wrapper = document.querySelector('#lenis-frame')
        if (!wrapper) return;

        lenis.value = new Lenis({
            wrapper,
            // The scrollable content lives inside the (fixed-height) wrapper.
            // Point Lenis at it so its ResizeObserver recomputes the scroll limit
            // when async content (Discord card, GitHub stats, …) grows the page.
            content: (wrapper.firstElementChild as HTMLElement) ?? undefined,
            lerp: reduced.value ? 1 : 0.09,
            smoothWheel: !reduced.value,
            wheelMultiplier: 0.5,
            // Enable touch scrolling (was 0, which broke scrolling on touch devices).
            touchMultiplier: 1,
        });
        lenis.value.on('scroll', ScrollTrigger.update);
    }

    onMounted(() => {
        if (lenis.value) return;
        create();

        gsap.ticker.add((time) => lenis.value?.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // Rebuild Lenis when the reduced-motion preference changes at runtime.
        watch(reduced, () => {
            lenis.value?.destroy();
            create();
        });
    });

    onUnmounted(() => {
        lenis.value?.destroy();
    });

    return lenis;
};
