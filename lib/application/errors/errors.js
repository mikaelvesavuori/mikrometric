"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LengthNotWithinBoundsError = exports.CannotAddMoreItemsToArrayError = exports.HasNonAsciiCharactersError = exports.MissingRequiredStartParamsError = void 0;
class MissingRequiredStartParamsError extends Error {
    constructor() {
        super();
        this.name = 'MissingRequiredStartParamsError';
        const message = `Missing namespace and/or service name while initializing MikroMetric!`;
        this.message = message;
        console.error(message);
    }
}
exports.MissingRequiredStartParamsError = MissingRequiredStartParamsError;
class HasNonAsciiCharactersError extends Error {
    constructor() {
        super();
        this.name = 'HasNonAsciiCharactersError';
        const message = `String contains non-ASCII characters!`;
        this.message = message;
        console.error(message);
    }
}
exports.HasNonAsciiCharactersError = HasNonAsciiCharactersError;
class CannotAddMoreItemsToArrayError extends Error {
    constructor(maximumLength) {
        super();
        this.name = 'CannotAddMoreItemsToArrayError';
        const message = `Cannot add more than ${maximumLength} metrics to a single metric log!`;
        this.message = message;
        console.error(message);
    }
}
exports.CannotAddMoreItemsToArrayError = CannotAddMoreItemsToArrayError;
class LengthNotWithinBoundsError extends Error {
    constructor(maximumLength) {
        super();
        this.name = 'LengthNotWithinBoundsError';
        const message = `Value must be between 1-${maximumLength} characters!`;
        this.message = message;
        console.error(message);
    }
}
exports.LengthNotWithinBoundsError = LengthNotWithinBoundsError;
//# sourceMappingURL=errors.js.map