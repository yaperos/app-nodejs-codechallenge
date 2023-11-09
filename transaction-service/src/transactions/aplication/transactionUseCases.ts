
import { DeleteResult } from "typeorm";
import { RetrieveTransaction } from "../domain/transaction.entity";
import { CreateTransactionInput } from "src/transactions/dto/create-transaction.input";


// Aqui solo esta la interface de los casos de uso, la implentacion concreta deberia
// esta en los services, dentro desde mi perspectiva pero he decido, aplicar la interface 
// directamente en el servicio por cuestiones de simplicidad en el codigo.

export interface ITransactionsServiceUseCase {
  retrieveTransaction(id: string): Promise<RetrieveTransaction>;
  retrieveAll(): Promise<RetrieveTransaction[]>;
  transaction(data: CreateTransactionInput): Promise<RetrieveTransaction>;
  delete(id: string): Promise<DeleteResult>;
}


