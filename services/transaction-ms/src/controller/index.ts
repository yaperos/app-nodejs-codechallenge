import { transactionService } from "../service";
import { TransactionController } from "./TransactionController";

export const controller = new TransactionController({
  service: transactionService,
});
