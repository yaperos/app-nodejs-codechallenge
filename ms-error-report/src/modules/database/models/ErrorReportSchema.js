const { Schema, SchemaTypes } = require("mongoose");

const { MongoDB } = require("../lib");

const ErrorReportSchema = new Schema(
  {
    transactionId: { type: SchemaTypes.String, required: true },
    name: { type: SchemaTypes.String },
    message: { type: SchemaTypes.String },
    stack: { type: Object },
  },
  MongoDB.schemaOptions
);

module.exports = { ErrorReportSchema };
