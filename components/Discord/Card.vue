<template>
    <div class="h-[400px] dark:text-slate-200 drop-shadow-xl">
        {{ DiscordPresence }}
    </div>
</template>


<script setup>
import { useLanyard } from '@leonardssh/use-lanyard';

const DiscordPresence = ref()

onMounted(async () => {
    console.log('TESST')
    await useLanyard({
        userId: '201077739589992448',
        socket: true,
        onPresenceUpdate(presence) {
            console.log('Update?', presence)
            DiscordPresence.value = presence || null;
            console.log(DiscordPresence.value);
        }
    });
})

</script>
