import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import Transaction from "../entities/transaction.entity";

@EventSubscriber()
export default class TransactionCreatedSubscriber
  implements EntitySubscriberInterface<Transaction>
{
  listenTo() {
    return Transaction;
  }

  afterInsert(event: InsertEvent<Transaction>) {
    console.log(`AFTER TRANSACTION INSERTED: `, event.entity);
  }
}
