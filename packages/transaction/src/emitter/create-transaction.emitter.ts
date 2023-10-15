import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { from } from "rxjs";
import { TransactionPayload } from "src/handlers/payload/transaction.payload";

@Injectable()
export class CreateTransactionEmitter {
  constructor(
    @Inject("ANTI_FRAUD_SERVICE") private readonly client: ClientProxy
  ) {}

  createTransactionEmitter(payload: TransactionPayload) {
    return from(
      this.client.emit("transaction_created", JSON.stringify(payload))
    );
  }
}
