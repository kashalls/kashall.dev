import Lenis from 'lenis';
import gsap, { wrap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const useLenis = () => {
    const lenis = useState<Lenis>('lenis');

    onMounted(() => {
        if (lenis.value) return;

        const wrapper = document.querySelector('#lenis-frame')
        if (!wrapper) return;

        lenis.value = new Lenis({ 
            wrapper,
            lerp: 0.09,
            wheelMultiplier: 0.5,
            touchMultiplier: 0
        });
        lenis.value.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => lenis.value.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    });

    onUnmounted(() => {
        lenis.value.destroy();
    });

    return lenis;
};