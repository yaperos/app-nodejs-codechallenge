import { logger } from "../config/logger";
import { TransactionData, sendStatusUpdate } from "../services/kafka";

export const validateTransaction = async (
  transactionData: TransactionData,
  transactionId: string
) => {
  const newStatus = transactionData.value > 1000 ? "REJECTED" : "APPROVED";
  logger.info(
    `Validating transaction. ID: ${transactionId}, Value: ${transactionData.value}, New Status: ${newStatus}`
  );
  sendStatusUpdate(transactionId, newStatus);
};


  