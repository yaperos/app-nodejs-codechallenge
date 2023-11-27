import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionByIdResponseDTO } from '../dto/transaction-by-id-response.dto';

export const mapTransactionToTransactionByIdResponseDTO = (t: Transaction) => {
  return new TransactionByIdResponseDTO(
    t.id,
    t.amount,
    t.createdAt,
    t.type.name,
    t.status.name,
  );
};
