const {
  TransactionErrorConsumerFactory,
  TransactionStatusPublisher
} = require("@yape-challenge/kafka");

const { ErrorReportModel } = require("../database");
const { ConfigEnv } = require("../../config");
const { RetryService } = require("../retry");

class ErrorReportService {
  static async init() {
    const transactionErrorConsumer = TransactionErrorConsumerFactory(
      ConfigEnv.serviceTag
    );
    await transactionErrorConsumer.subscribe(
      async (message) => {
        const { errorType } = message;
        console.log("Error report service received an error", `[TYPE] ${errorType}`);
        switch (errorType) {
          case 'transaction':
            ErrorReportService.processTransactionError(message);
            break;
          case 'unrecordedTransaction':
            ErrorReportService.processUnrecordedTransaction(message);
            break;
          default:
            console.log("TypeError not processed", error, JSON.stringify(message));
        }
      }
    );
  }

  /**
   * Processes errors associated with unrecorded transactions.
   * 
   * @param {Object} message - The message containing details about the unrecorded transaction error.
   * @static
   * @async
   */
  static async processUnrecordedTransaction(message) {
    try {
      console.log("Processing unrecorded transaction", JSON.stringify(message));
      const { reportedBy, errorType, unrecordedTransaction, correlationId, error } = message;
      await ErrorReportModel.create({
        reportedBy,
        errorType,
        unrecordedTransaction,
        correlationId,
        error,
      });
    } catch (error) {
      console.error("Error not processed", error, JSON.stringify(message));
    }
  }

  /**
   * Processes transaction errors and performs retries or updates based on specific conditions.
   * 
   * @param {Object} message - The message containing details about the transaction error.
   * @static
   * @async
   */
  static async processTransactionError(message) {
    try {
      console.log("Processing transaction error", JSON.stringify(message));
      const { reportedBy, errorType, error, transactionId } = message;
      const existingRecord = await ErrorReportModel.findOne({ transactionId }).lean();

      if (!existingRecord) {
        await ErrorReportModel.create({
          reportedBy,
          errorType,
          transactionId,
          error,
          attempts: 1,
        });
      } else if (existingRecord.attempts >= 3) {
        await ErrorReportModel.updateOne(
          { transactionId },
          {
            $set: { error: { name: 'TransactionError', message: 'Transaction could not be processed after 3 attempts', stack: null } }
          }
        );
        await TransactionStatusPublisher.publish({
          transactionId,
          status: 'error'
        })
        return;
      } else {
        await ErrorReportModel.updateOne({ transactionId }, { $inc: { attempts: 1 } });
      }

      if (!existingRecord || existingRecord.attempts < 3) {
        await RetryService.scheduleRetry(transactionId, existingRecord ? existingRecord.attempts + 1 : 1);
      }
    } catch (error) {
      console.error("Error processing transaction error", { error: error.message, message });
    }
  }
}


module.exports = {
  ErrorReportService,
};
