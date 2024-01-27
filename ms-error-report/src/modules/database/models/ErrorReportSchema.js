const { Schema, SchemaTypes } = require("mongoose");

const { MongoDB } = require("../lib");

const UnrecordedTransactionSchema = new Schema({
  accountExternalIdDebit: { type: SchemaTypes.String },
  accountExternalIdCredit: { type: SchemaTypes.String },
  transferTypeId: { type: SchemaTypes.Number },
  value: { type: SchemaTypes.Number },
}, { _id: false })

const ErrorSchema = new Schema({
  name: { type: SchemaTypes.String },
  message: { type: SchemaTypes.String },
  stack: { type: SchemaTypes.Object },
}, { _id: false });

const ErrorReportSchema = new Schema(
  {
    errorType: { type: SchemaTypes.String, required: true },
    reportedBy: { type: SchemaTypes.String, required: true },
    transactionId: { type: SchemaTypes.String },
    correlationId: { type: SchemaTypes.String },
    attempts: { type: SchemaTypes.Number },
    error: { type: ErrorSchema },
    unrecordedTransaction: { type: UnrecordedTransactionSchema },
  },
  MongoDB.schemaOptions
);

module.exports = { ErrorReportSchema };
