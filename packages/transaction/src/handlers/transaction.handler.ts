import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionPayload } from "./payload/create-transaction.payload";

@Controller()
export class TransactionHandler {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern("transaction_updated")
  createTransactionEvent(@Payload() { id, status }: CreateTransactionPayload) {
    this.transactionService.update(id, status).subscribe();
  }
}
