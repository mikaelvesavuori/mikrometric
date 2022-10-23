export declare class MissingRequiredStartParamsError extends Error {
    constructor();
}
export declare class HasNonAsciiCharactersError extends Error {
    constructor();
}
export declare class CannotAddMoreItemsToArrayError extends Error {
    constructor(maximumLength: number);
}
export declare class LengthNotWithinBoundsError extends Error {
    constructor(maximumLength: number);
}
