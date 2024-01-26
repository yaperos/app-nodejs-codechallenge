const { ErrorReportSchema } = require("./ErrorReportSchema");
const { MongoDB } = require("../lib");

const ErrorReportModel = MongoDB.getConnection().model(
  "ErrorReport",
  ErrorReportSchema,
  "error_reports"
);

module.exports = {
  ErrorReportModel,
};
