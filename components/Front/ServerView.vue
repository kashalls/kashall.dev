<template>
    <div class="w-[400px] dark:text-slate-200 drop-shadow-xl">
        <div class="flex mb-4">
            <p class="text-lg mr-2">Home Cluster</p>
            <span
                class="px-2 py-1 rounded-full text-white bg-green-700 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">
                KASH@HOME
            </span>
        </div>
        <div class="h-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900">
            <!-- headerWrapper -->

            <!-- Switch Box-->
            <div class="m-4 px-6 py-4 rounded-lg bg-gray-800">
                <!-- Ports-->
                <div class="grid grid-cols-3 grid-rows-2 grid-flow-col">
                    <div class="mb-2 col-span-2">
                        <span v-for="port in switchPorts.slice(0, 12)" :key="port.port"
                            class="w-[18px] h-[18px] mx-[2px]" :class="port.color"> </span>
                    </div>
                    <div class="mb-2 col-span-2">
                        <span v-for="port in switchPorts.slice(13, 25)" :key="port.port"
                            class="w-[18px] h-[18px] mx-[2px]" :class="port.color"> </span>
                    </div>
                    <div class="row-span-1 flex justify-end justify-items-end">
                        <span v-for="port in switchPorts.slice(25, 27)" :key="port.port"
                            class="w-[18px] h-[18px] mx-[2px]" :class="port.color"> </span>
                    </div>
                    <div class="row-span-1 flex justify-end justify-items-end">
                        <span v-for="port in switchPorts.slice(27, 29)" :key="port.port"
                            class="w-[18px] h-[18px] mx-[2px]" :class="port.color"> </span>
                    </div>
                </div>
            </div>

            <div class="m-4 px-6 py-4 rounded-lg bg-gray-800">
                <div class="grid grid-flow-col-dense">
                    <span class="w-[24px] h-[24px] bg-gray-900 rounded-md self-center" />
                    <span class="w-[96px] h-[24px] bg-gray-900 rounded-md self-center" />
                    <div class="grid grid-cols-4 grid-rows-2 grid-flow-col">
                        <span v-for="port in udmp.slice(0, 8)" :key="port.port" class="w-[18px] h-[18px] my-[2px]"
                            :class="port.color" />
                    </div>
                    <span v-for="port in switchPorts.slice(8, 9)" :key="port.port"
                        class="w-[18px] h-[18px] mx-[2px] self-end justify-self-end" :class="port.color"> </span>
                    <div class="grid grid-cols-1 grid-rows-2 grid-flow-col justify-self-end">
                        <span v-for="port in udmp.slice(10, 12)" :key="port.port" class="w-[18px] h-[18px] my-[2px]"
                            :class="port.color" />
                    </div>
                </div>
            </div>

            <div class="m-4 px-6 py-4 rounded-lg bg-gray-800">
                <div class="grid grid-flow-dense grid-rows-1 grid-cols-5 justify-items-center">
                    <div class="flex w-[48px] h-[96px] bg-gray-900 rounded-md justify-center">
                        <span class="w-[18px] h-[18px] flex-col mt-2 bg-blue-600 rounded-full" />
                    </div>
                    <div class="flex w-[48px] h-[96px] bg-gray-900 rounded-md justify-center">
                        <span class="w-[18px] h-[18px] flex-col mt-2 bg-blue-600 rounded-full" />
                    </div>
                    <div class="flex w-[48px] h-[96px] bg-gray-900 rounded-md justify-center">
                        <span class="w-[18px] h-[18px] flex-col mt-2 bg-blue-600 rounded-full" />
                    </div>
                    <div class="flex w-[48px] h-[96px] bg-gray-900 rounded-md justify-center">
                        <span class="w-[18px] h-[18px] flex-col mt-2 bg-blue-600 rounded-full" />
                    </div>
                    <div class="flex w-[48px] h-[96px] bg-gray-900 rounded-md justify-center">
                        <span class="w-[18px] h-[18px] flex-col mt-2 bg-blue-600 rounded-full" />
                    </div>
                </div>
            </div>

            <div class="m-4 px-6 py-4 rounded-lg bg-gray-800">
                <div class="bg-gray-900 w-full h-[18px] rounded-xl">
                    <div class="bg-gradient-to-r from-green-900 to-green-500 w-[80%] h-full rounded-xl">
                        <span>
                            <p class="pl-2 float-left text-xs">Battery</p>
                            <p class="float-right text-xs pr-2">80%</p>
                        </span>
                    </div>
                </div>
            </div>

            <div class="m-4 px-6 py-4 rounded-lg bg-gray-800">
                <div class="grid grid-cols-2 grid-rows-1 grid-flow-col-dense">
                    <div class="justify-center">
                        <p class="font-semibold text-center">450MBPS</p>
                    </div>
                    <div class="justify-center">
                        <p class="font-semibold text-center">450MBPS</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>



const udmp = []
const switchPorts = []

for (let port = 0; port < 29; port++) {
    let defaultSettings = { port, speed: '1000', spf: Boolean(port > 24), color: Math.random() < 0.55 ? 'bg-green-600' : 'bg-gray-600' }
    // Runs 28 times, with values of step 0 through 28.
    switchPorts.push(defaultSettings)
}

for (let port = 0; port < 12; port++) {
    let defaultSettings = { port, speed: '1000', color: Math.random() < 0.55 ? 'bg-green-600' : 'bg-gray-600' }

    udmp.push(defaultSettings)
}

</script>