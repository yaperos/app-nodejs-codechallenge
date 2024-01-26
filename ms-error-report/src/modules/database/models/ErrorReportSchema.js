const { Schema, SchemaTypes } = require("mongoose");

const { MongoDB } = require("../lib");

const ErrorReportSchema = new Schema(
  {
    reportedBy: { type: SchemaTypes.String, required: true },
    transactionId: { type: SchemaTypes.String },
    correlationId: { type: SchemaTypes.String },
    name: { type: SchemaTypes.String },
    message: { type: SchemaTypes.String },
    stack: { type: Object },
  },
  MongoDB.schemaOptions
);

module.exports = { ErrorReportSchema };
