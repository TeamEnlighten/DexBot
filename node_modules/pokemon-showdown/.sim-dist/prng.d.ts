/**
 * PRNG
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This simulates the on-cartridge PRNG used in the real games.
 *
 * In addition to potentially allowing us to read replays from in-game,
 * this also makes it possible to record an "input log" (a seed +
 * initial teams + move/switch decisions) and "replay" a simulation to
 * get the same result.
 *
 * @license MIT license
 */
/** 64-bit big-endian [high -> low] int */
export declare type PRNGSeed = [number, number, number, number];
/**
 * A PRNG intended to emulate the on-cartridge PRNG for Gen 5 with a 64-bit
 * initial seed.
 */
export declare class PRNG {
    readonly initialSeed: PRNGSeed;
    seed: PRNGSeed;
    /** Creates a new source of randomness for the given seed. */
    constructor(seed?: PRNGSeed | null);
    /**
     * Getter to the initial seed.
     *
     * This should be considered a hack and is only here for backwards compatibility.
     */
    get startingSeed(): PRNGSeed;
    /**
     * Creates a clone of the current PRNG.
     *
     * The new PRNG will have its initial seed set to the seed of the current instance.
     */
    clone(): PRNG;
    /**
     * Retrieves the next random number in the sequence.
     * This function has three different results, depending on arguments:
     * - random() returns a real number in [0, 1), just like Math.random()
     * - random(n) returns an integer in [0, n)
     * - random(m, n) returns an integer in [m, n)
     * m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.
     */
    next(from?: number, to?: number): number;
    /**
     * Flip a coin (two-sided die), returning true or false.
     *
     * This function returns true with probability `P`, where `P = numerator
     * / denominator`. This function returns false with probability `1 - P`.
     *
     * The numerator must be a non-negative integer (`>= 0`).
     *
     * The denominator must be a positive integer (`> 0`).
     */
    randomChance(numerator: number, denominator: number): boolean;
    /**
     * Return a random item from the given array.
     *
     * This function chooses items in the array with equal probability.
     *
     * If there are duplicate items in the array, each duplicate is
     * considered separately. For example, sample(['x', 'x', 'y']) returns
     * 'x' 67% of the time and 'y' 33% of the time.
     *
     * The array must contain at least one item.
     *
     * The array must not be sparse.
     */
    sample<T>(items: readonly T[]): T;
    /**
     * A Fisher-Yates shuffle. This is how the game resolves speed ties.
     *
     * At least according to V4 in
     * https://github.com/smogon/pokemon-showdown/issues/1157#issuecomment-214454873
     */
    shuffle<T>(items: T[], start?: number, end?: number): void;
    /**
     * Calculates `a * b + c` (with 64-bit 2's complement integers)
     *
     * If you've done long multiplication, this is the same thing.
     */
    multiplyAdd(a: PRNGSeed, b: PRNGSeed, c: PRNGSeed): PRNGSeed;
    /**
     * The RNG is a Linear Congruential Generator (LCG) in the form: `x_{n + 1} = (a x_n + c) % m`
     *
     * Where: `x_0` is the seed, `x_n` is the random number after n iterations,
     *
     * ````
     * a = 0x5D588B656C078965
     * c = 0x00269EC3
     * m = 2^64
     * ````
     */
    nextFrame(seed: PRNGSeed, framesToAdvance?: number): PRNGSeed;
    static generateSeed(): PRNGSeed;
}
