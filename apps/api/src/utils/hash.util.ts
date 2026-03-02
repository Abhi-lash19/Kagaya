/**
 * Deterministic hash function
 * Converts string to number between 0–99
 * Used for percentage rollout evaluation
 */
export function percentageHash(input: string): number {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    // Make positive and constrain to 0–99
    return Math.abs(hash) % 100;
}