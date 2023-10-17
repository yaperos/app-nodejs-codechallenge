import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';

export interface ProcessRiskLevel {
  execute(transaction: CreateTransactionRequestDto): Promise<number>;
}
