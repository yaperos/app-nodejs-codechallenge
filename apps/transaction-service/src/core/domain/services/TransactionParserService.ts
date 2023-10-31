import { Transaction, TransactionOutput } from '../models';

export interface TransactionParserService {
  parse(transaction: Transaction): TransactionOutput;
}
