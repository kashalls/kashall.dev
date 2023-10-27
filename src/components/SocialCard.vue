<template>
    <div ref="socialCard" class="w-full max-w-sm flex flex-row items-center p-6 rounded-xl shadow-xl hover:bg-slate-300/60" @mousemove="mousemove"
        :style="colors.brand_opacity" @mouseleave="mouseleave">

        <div class="h-12 w-12 justify-center rounded-lg mr-2" :style="colors.brand">
            <Icon class="h-12 w-12 justify-center text-white border-transparent border-8" size="18px" :name="social.icon" />
        </div>
        <div class="flex flex-col flex-1">
            <h5 class="font-semibold text-gray-900 dark:text-white">
                {{ social.name }}
            </h5>
            <span class="text-base text-gray-200">
                {{ social.username }}
            </span>
        </div>
        <a :href="social.button.url"
            class="inline-flex items-center px-4 py-2 text-sm font-medium transition duration-300 ease text-center text-gray-50 bg-slate-800/60 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            {{ social.button.description }}
        </a>
    </div>
</template>

<script setup>
const { social } = defineProps({
    social: {
        type: Object,
        required: true,
    },
});

const colors = computed(() => {
    return {
        brand: `background-color: ${social.brand};`,
        brand_opacity: `background-color: ${social.brand};`
    };
});

const socialCard = ref(null)
const calc = (x, y) => ({
    rotateX: (-(y - window.innerHeight / 2) / 30),
    rotateY: (-(x - window.innerWidth / 2) / 30),
    scale: 1.05
})

const variants = ref({
    initial: {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        perspective: '200px'
    }
})

const motionInstance = useMotion(socialCard, variants)
const mousemove = ({ clientX, clientY }) =>
    motionInstance.apply({
        ...calc(clientX, clientY),
        transition: {
            mass: 2,
        }
    });
const mouseleave = () => motionInstance.apply('initial')
</script>
