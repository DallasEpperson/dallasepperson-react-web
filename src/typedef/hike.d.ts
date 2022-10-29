type Hike = {
    /** Starting date of the hike in seconds past epoch. */
    date: number,

    /** Distance in meters for this hike. */
    distance: number,

    /** ID of the hike. */
    id: number,

    /** Name of the hike. */
    name: string,

    /** True if this hike was done was completed in both directions. */
    outAndBack: boolean?,

    /** Array of coordinates. */
    path: [number, number][]
};