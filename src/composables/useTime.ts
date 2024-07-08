export const useTimestamp = () => {
    const timestamp = ref(Date.now());

    const updateCurrentTime = () => {
        timestamp.value = Date.now();
    };
    let updateTimeInterval: NodeJS.Timeout
    onMounted(() => {
        updateTimeInterval = setInterval(updateCurrentTime, 1000);
    })


    onBeforeUnmount(() => {
        clearInterval(updateTimeInterval);
    });
    return {
        timestamp,
    };
}