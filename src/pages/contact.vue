<template>
    <div class="mx-auto max-w-7xl grid lg:grid-cols-2 grid-cols-1">
        <div class="lg:py-48 lg:px-8 lg:static lg:pt-20 pb-20 px-6 relative">
            <div class="max-w-xl mx-auto lg:mx-0 lg:max-w-lg">
                <h2 class="text-white font-bold text-4xl mb-5">
                    Let's get down to business.
                </h2>
                <p class="text-gray-300">
                    Have an idea you want to bring to life? Interested in a project I am involved in? Fill out this form and
                    it will be printed right out on my desk!
                </p>
                <div class="leading-7 text-base mt-10">
                    <span class="text-gray-300 mt-10 mb-1.5 font-semibold">
                        Contact Me Via Email
                    </span>
                    <div
                        class="border border-solid border-gray-500 text-gray-300 flex h-10 transition-opacity ease-in-out pl-3 rounded-lg pr-1.5 items-center">
                        <span ref="email" class="select-text">hello@jordanjones.org</span>
                        <div class="ml-auto flex flex-row">
                            <span class="bg-black text-white items-center ease-in-out rounded-md flex text-sm h-7 mr-1.5 px-1.5 animate-inandout">Copied</span>
                            <button>
                                <Icon class="font-black" :name="icon" @click="copyEmail" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form class="lg:py-48 lg:px-8 sm:pb-32 lg:pt-20 pb-24 px-6" @submit.prevent="onSubmit">
            <div class="lg:max-w-lg lg:mr-0 max-w-xl mx-auto">
                <div class="sm:grid-cols-2 gap-y-6 gap-x-8 grid-cols-1 grid">
                    <div>
                        <label for="first-name" class="block text-sm font-semibold leading-6 text-white">
                            First name
                        </label>
                        <div class="mt-2.5">
                            <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                                class="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow ring-inset ring-white/10 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    <div>
                        <label for="last-name" class="block text-sm font-semibold leading-6 text-white">
                            Last name
                        </label>
                        <div class="mt-2.5">
                            <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                                class="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow ring-inset ring-white/10 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    <div class="col-span-2">
                        <label for="email" class="block text-sm font-semibold leading-6 text-white">
                            Email
                        </label>
                        <div class="mt-2.5">
                            <input type="email" name="email" id="email" autocomplete="email"
                                class="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow ring-inset ring-white/10 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    <div class="col-span-2">
                        <label for="phone-number" class="block text-sm font-semibold leading-6 text-white">
                            Phone number
                        </label>
                        <div class="mt-2.5">
                            <input type="tel" name="phone-number" id="phone-number" autocomplete="tel"
                                class="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow ring-inset ring-white/10 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    <div class="col-span-2">
                        <label for="message" class="block text-sm font-semibold leading-6 text-white">
                            Message
                        </label>
                        <div class="mt-2.5">
                            <textarea name="message" id="message" rows="4"
                                class="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow ring-inset ring-white/10 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <NuxtTurnstile class="flex justify-end" v-model="turnstile" />
                    </div>
                </div>
                <div class="flex justify-end mt-8">
                    <button type="submit"
                        class="rounded-md bg-purple-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow">
                        Send Message
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
const turnstile = ref()

const icon = ref('fa6-solid:copy')
const email = ref(null)
const copyEmail = () => {
    navigator.clipboard.writeText(email.value.textContent)
    icon.value = 'fa6-solid:check'
    setTimeout(() => {
        icon.value = 'fa6-solid:copy'
    }, 2500)
}

const form = ref({ first: '', last: '', email: '', phone: '', message: '' })

const onSubmit = (event) => {
    console.log(event)
}
</script>