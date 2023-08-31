import { producer } from "../../../shared/infrastructure/kafka";
import Status from "../../domain/status/statusHelper";
import Topics from "../../domain/topic/topics";
import { ITransactionRepository } from "../../domain/transaction/ItransactionRepository";
import { ITransactionPersistence } from "../../domain/transaction/objects/ITransactionPersistence";
import { Itransaction } from "../../domain/transaction/objects/ItransactionRequest";

export class CreateTransactionService {
  constructor(private transactionRepository: ITransactionRepository) {}

  public async invoke(transaction: Itransaction): Promise<void> {
    let newTransaction: ITransactionPersistence = {
      ...transaction,
      status: Status.PENDING,
    };
    const finalTransaction = await this.transactionRepository.create(
      newTransaction
    );
    await producer.send({
      topic: Topics.pending,
      messages: [{ value: JSON.stringify(finalTransaction) }],
    });
  }
}
