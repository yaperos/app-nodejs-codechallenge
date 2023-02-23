"use strict";

const Exception = require("./Exception");

class ValidationException extends Exception {
  constructor(error) {
    super(error.code, error.message, error.httpCode);
  }
}

module.exports = ValidationException;
