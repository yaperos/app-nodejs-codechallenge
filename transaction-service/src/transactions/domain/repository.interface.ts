import { ITransactionEntity } from "./entity.interface";
import { DTOCreateTransaction } from "./dto.interface";

export interface ITransactionsRepository {
  retrieve(id: string): Promise<ITransactionEntity>;
  retrieveAll(): Promise<ITransactionEntity[]>;
  transaction(data: DTOCreateTransaction): Promise<ITransactionEntity>;
}