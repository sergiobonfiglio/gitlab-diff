export function tryUntilTrue(fn: () => boolean) {
    let tId = 0
    tId = setInterval(() => {
        const res = fn();
        if (res) {
            clearInterval(tId)
        }
    }, 250)
}
