<template>
    <div class="flex flex-col p-7 border border-gray-950 rounded-xl bg-gray-900 shadow-2xl">
            <div class="flex flex-col items-center sm:items-start sm:flex-row flex-grow">
                <img class="rounded-lg h-24 mr-5 w-24 flex justify-center sm:justify-start"
                    src="https://avatars.githubusercontent.com/u/17620516?v=4">
                <div class="font-semibold text-gray-400 items-center">
                    <h1 class="mb-1 text-3xl text-gray-50 font-bold text-center sm:text-left">Hi, I'm Jordan!</h1>
                    <p class="text-center sm:text-left">🧙‍♂️ Freelance Software and Datarack Engineer</p>
                    <p class="text-center sm:text-left"> {{ lanyard.status_message }} </p>
                </div>
            </div>
    </div>
    <div
        class="items-center relative p-2 -mx-3 -mt-3 rounded-lg text-gray-100 shadow-lg bg-gray-950 overflow-hidden hidden xl:flex">
        <div class="z-10 flex flex-col md:flex-row w-full items-center md:text-left px-4 py-2 m-2">
            <template v-if="lanyard.listening_to_spotify">
                <div class="flex-1">
                    <p>
                        🎧 <span class="font-semibold">{{ lanyard.spotify?.song }}</span> by <span class="font-semibold">{{
                            lanyard.spotify.artist }}</span>
                    </p>
                    <p>
                        {{ formatTime(hearbeatTimeNow - lanyard.spotify?.timestamps?.start) }} / {{
                            formatTime(currentTrackInfo.track_length) }}
                    </p>
                </div>
                <a class="bg-[#1DB954] text-white rounded-md px-4 py-1.5 m-2 transition duration-500 ease select-none hover:bg-[#3beb78]"
                    :href="`https://open.spotify.com/track/${lanyard.spotify.track_id}`" target="_blank">
                    Listen On Spotify
                </a>
            </template>
            <template v-else>
                Not listening to anything right now.
            </template>
        </div>
        <div :style="`background-image: url(${lanyard?.spotify?.album_art_url})`"
            class="left-0 opacity-30 absolute select-none h-full w-full bg-center bg-cover shadow-2xl"></div>
    </div>
</template>

<script setup>
import { useLanyard } from "@leonardssh/use-lanyard";
const { public: { DISCORD_USER_ID } } = useRuntimeConfig()
const statusOptions = {
    offline: '😞 I\'m not on my computer right now.',
    idle: '🤔 Currently idling.',
    dnd: '🥺 Currently in the middle of something. Please do not disturb.',
    online: '😉 Currently active!',
    mobile: '😶‍🌫️ Currently mobile!'
}
const lanyard = ref({
    activities: [],
    discord_status: 'offline',
    listening_to_spotify: false,
    idealActivity: statusOptions['offline']
})
const statusMessage = ref()
watch(
    () => lanyard.value.discord_status,
    () => {
        if (lanyard.value.discord_status === 'active_on_discord_mobile') {
            return statusMessage.value = statusOptions['mobile']
        } else {
            return statusMessage.value = statusOptions[lanyard.value.discord_status]
        }
    }
)

const currentTrackInfo = ref({})
watch(
    () => lanyard.value.spotify,
    () => {
        const spotify = lanyard.value.spotify
        if (!spotify) return currentTrackInfo.value = {}
        currentTrackInfo.value.track_length = spotify.timestamps.end - spotify.timestamps.start
    }
)

let heartbeatInterval = ref();
let hearbeatTimeNow = ref();
onMounted(() => {
    heartbeatInterval = setInterval(() => {
        hearbeatTimeNow.value = Date.now()
    })
})
onBeforeUnmount(() => {
    clearInterval(heartbeatInterval)
})

function formatTime(millis) {
    const minutes = Math.floor(millis / 60000)
    const seconds = Number(((millis % 60000) / 1000).toFixed(0))
    return seconds === 60
        ? minutes + 1 + ':00'
        : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

if (process.browser) {
    useLanyard({
        userId: DISCORD_USER_ID,
        socket: true,
        onPresenceUpdate(presence) {
            lanyard.value = presence
            const filteredActivities = presence.activities.filter((activity) => activity.id !== 'spotify:1')
            lanyard.value.idealActivity = presence.activities.indexOf(filteredActivities[0])

            // Status Message
            if (presence.active_on_discord_mobile) {
                lanyard.value.status_message = statusOptions['mobile']
            } else {
                lanyard.value.status_message = statusOptions[presence.discord_status]
            }
        }
    })
}
</script>
