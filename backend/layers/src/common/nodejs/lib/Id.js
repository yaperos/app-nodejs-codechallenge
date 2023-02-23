"use strict";

const ULID = require("ulid");

class Id {
  static generate() {
    return ULID.ulid();
  }
}

module.exports = Id;
