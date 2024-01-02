import { UUID } from "crypto";
import { TransactionStatusEnum } from "../enum";

export type NEW_STATUS_TRANSACTION = { transactionId: UUID, status: TransactionStatusEnum };
