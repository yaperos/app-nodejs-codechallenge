import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class TransactionEventsRequestDto {
  @IsString()
  eventType: string;

  @IsString()
  aggregateId: string;

  @IsString()
  timestamp: string;

  @Type(() => Object)
  payload: Record<string, any>;
}
