const {
  TransactionErrorConsumerFactory,
  TransactionStatusPublisher,
} = require("@yape-challenge/kafka");

const { ErrorReportModel } = require("../database");
const { ConfigEnv } = require("../../config");

class ErrorReportService {
  static #messageError = "ERROR";

  static async init() {
    const transactionErrorConsumer = TransactionErrorConsumerFactory(
      ConfigEnv.serviceTag
    );
    await transactionErrorConsumer.subscribe(
      async ({ error, transactionId }) => {
        console.log("Error report service received an error");

        const record = {
          transactionId,
          message: error.message,
          name: error.name,
          stack: error.stack,
        };

        if (!transactionId) return;

        await ErrorReportModel.create(record);

        await TransactionStatusPublisher.publish({
          transactionId,
          status: ErrorReportService.#messageError,
        });
      }
    );
  }
}

module.exports = {
  ErrorReportService,
};
