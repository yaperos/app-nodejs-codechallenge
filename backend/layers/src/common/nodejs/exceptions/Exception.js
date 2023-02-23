"use strict";

class Exception extends Error {
  constructor(code, message, httpStatusCode) {
    super(message);

    this.code = code;
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = Exception;
