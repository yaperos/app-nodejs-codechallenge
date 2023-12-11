import { UpdateTransactionDto } from 'src/models/dto/update-transaction.dto';

export interface UpdateEvent extends Event {
  params: UpdateTransactionDto;

  // update(): Promise<void>;
}
