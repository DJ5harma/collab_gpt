export function do_every_n_days(n: number) {
    const now = Date.now();
    const daysSinceEpoch = Math.floor(now / (1000 * 60 * 60 * 24)); // Convert to days
    const shouldTrigger = daysSinceEpoch % n === 0; // Every 2 days
    return shouldTrigger;
}
