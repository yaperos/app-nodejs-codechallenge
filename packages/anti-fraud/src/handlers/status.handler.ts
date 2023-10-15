import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TransactionBusiness } from "src/business/transaction.business";
import { TransactionPayload } from "src/handlers/payload/transaction.payload";

@Controller()
export class StatusEventHandler {
  constructor(private readonly transactionBusiness: TransactionBusiness) {}

  @EventPattern("transaction_created")
  handleUserCreated(@Payload() { id, value }: TransactionPayload) {
    this.transactionBusiness.validateTransaction(id, value).subscribe();
  }
}
