import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Status } from "src/enums/status.enum";

@Injectable()
export class TransactionBusiness {
  constructor(
    @Inject("TRANSACTION_SERVICE")
    private readonly client: ClientProxy
  ) {}

  validateTransaction(id: string, amount: number) {
    const status = amount > 1000 ? Status.REJECTED : Status.APPROVED;

    return this.client.emit(
      "transaction_updated",
      JSON.stringify({ id, status })
    );
  }
}
