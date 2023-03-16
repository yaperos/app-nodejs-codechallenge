"use strict";

module.exports = {
  "check-coverage": false,
  "report-dir": "./coverage",
  branches: 100,
  functions: 100,
  lines: 100,
  statements: 100,
  exclude: [
    "src/controller/kafka.controller.ts",
  ],
};
