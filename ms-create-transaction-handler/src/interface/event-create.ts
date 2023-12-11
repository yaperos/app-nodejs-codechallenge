import { CreateTransactionDto } from 'src/models/dto/create-transaction.dto';
import { Event } from './event';

export interface CreateEvent extends Event {
  params: CreateTransactionDto;

  // save(): Promise<void>;
  // enqueue(): Promise<void>;
}
