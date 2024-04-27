"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/application/errors/errors.ts
var errors_exports = {};
__export(errors_exports, {
  CannotAddMoreItemsToArrayError: () => CannotAddMoreItemsToArrayError,
  HasNonAsciiCharactersError: () => HasNonAsciiCharactersError,
  LengthNotWithinBoundsError: () => LengthNotWithinBoundsError,
  MissingRequiredStartParamsError: () => MissingRequiredStartParamsError
});
module.exports = __toCommonJS(errors_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CannotAddMoreItemsToArrayError,
  HasNonAsciiCharactersError,
  LengthNotWithinBoundsError,
  MissingRequiredStartParamsError
});
