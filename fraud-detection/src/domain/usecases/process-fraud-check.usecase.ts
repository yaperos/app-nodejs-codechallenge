import { TransactionCreatedMessageDto } from '../dto/transaction-created-message.dto';

export interface ProcessFraudCheckUseCase {
  execute(message: TransactionCreatedMessageDto): Promise<void>;
}
