export function formatTime(millis: number): string {
    const minutes = Math.floor(millis / 60000)
    const seconds = Number(((millis % 60000) / 1000).toFixed(0))
    return seconds === 60
        ? minutes + 1 + ':00'
        : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export function formatFancyTime(millis: number): string {
    // Calculate time components
    const days = Math.floor(millis / (24 * 60 * 60 * 1000));
    const hours = Math.floor((millis % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((millis % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((millis % (60 * 1000)) / 1000);

    // Build the formatted string
    let result = '';

    if (days > 0) {
        result += days + 'd ';
    }

    if (hours > 0 || days > 0) {
        result += hours + 'h ';
    }

    if (minutes > 0 || hours > 0 || days > 0) {
        result += minutes + 'm ';
    }

    result += seconds + 's';
    return result.trim();
}


