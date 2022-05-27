export function timeString(milliSecond: number) {
    return `${prependNumber(milliSecond / 60000)}:${prependNumber((milliSecond % 60000) / 1000)}.${prependNumber((milliSecond % 1000) / 10)}`;
}

export function prependNumber(num: number) {
    return String(Math.floor(num)).padStart(2, '0');
}

export function calculateTimerPosition(windowWidth: number, timerWidth: number) {
    return (windowWidth / 2) - (timerWidth / 2);
}