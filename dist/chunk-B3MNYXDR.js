// src/application/errors/errors.ts
var MissingRequiredStartParamsError = class extends Error {
  constructor() {
    super();
    this.name = "MissingRequiredStartParamsError";
    const message = `Missing namespace and/or service name while initializing MikroMetric!`;
    this.message = message;
    console.error(message);
  }
};
var HasNonAsciiCharactersError = class extends Error {
  constructor() {
    super();
    this.name = "HasNonAsciiCharactersError";
    const message = `String contains non-ASCII characters!`;
    this.message = message;
    console.error(message);
  }
};
var CannotAddMoreItemsToArrayError = class extends Error {
  constructor(maximumLength) {
    super();
    this.name = "CannotAddMoreItemsToArrayError";
    const message = `Cannot add more than ${maximumLength} metrics to a single metric log!`;
    this.message = message;
    console.error(message);
  }
};
var LengthNotWithinBoundsError = class extends Error {
  constructor(maximumLength) {
    super();
    this.name = "LengthNotWithinBoundsError";
    const message = `Value must be between 1-${maximumLength} characters!`;
    this.message = message;
    console.error(message);
  }
};

export {
  MissingRequiredStartParamsError,
  HasNonAsciiCharactersError,
  CannotAddMoreItemsToArrayError,
  LengthNotWithinBoundsError
};
