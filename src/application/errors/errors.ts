/**
 * @description Used when missing required start-up parameters.
 */
export class MissingRequiredStartParamsError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequiredStartParamsError';
    const message = `Missing namespace and/or service name while initializing MikroMetric!`;
    this.message = message;

    console.error(message);
  }
}

/**
 * @description Used when a string has non-ASCII characters.
 */
export class HasNonAsciiCharactersError extends Error {
  constructor() {
    super();
    this.name = 'HasNonAsciiCharactersError';
    const message = `String contains non-ASCII characters!`;
    this.message = message;

    console.error(message);
  }
}

/**
 * @description Used when no more items are allowed to be added to an array.
 */
export class CannotAddMoreItemsToArrayError extends Error {
  constructor(maximumLength: number) {
    super();
    this.name = 'CannotAddMoreItemsToArrayError';
    const message = `Cannot add more than ${maximumLength} metrics to a single metric log!`;
    this.message = message;

    console.error(message);
  }
}

/**
 * @description Used when a string is either too short or too long.
 */
export class LengthNotWithinBoundsError extends Error {
  constructor(maximumLength: number) {
    super();
    this.name = 'LengthNotWithinBoundsError';
    const message = `Value must be between 1-${maximumLength} characters!`;
    this.message = message;

    console.error(message);
  }
}
