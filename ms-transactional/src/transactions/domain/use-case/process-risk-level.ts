import { Transaction } from '../entity/transaction';

export interface ProcessRiskLevel {
  execute(transaction: Transaction): Promise<number>;
}
