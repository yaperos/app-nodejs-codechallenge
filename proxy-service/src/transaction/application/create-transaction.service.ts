import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTransactionRequestDto } from '../domain/dtos/create-transaction-request.dto';
import { PubsubInterface } from '../domain/pubsub.interface';
import { v4 as uuid } from 'uuid';
import { EventType } from '../domain/enum/event-type';
import { CreateTransactionResponseDto } from '../domain/dtos/create-transaction-response.dto';

@Injectable()
export class CreateTransactionService {
  constructor(private readonly pubsubService: PubsubInterface) {}

  async execute(
    request: CreateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    try {
      const generatedId = uuid();

      request.type = EventType.CREATE;
      request.transactionId = generatedId;
      const message = JSON.stringify(request);
      this.pubsubService.publish(
        process.env.KAFKA_DB_WRITE_EVENT_TOPIC,
        message,
      );

      const updateRequest = {
        transactionId: generatedId,
        value: request.value,
      };
      this.pubsubService.publish(
        process.env.KAFKA_ANTIFRAUD_EVENT_TOPIC,
        JSON.stringify(updateRequest),
      );

      return {
        message: 'The transaction is being processed.',
        transactionExternalId: generatedId,
      };
    } catch (error) {
      Logger.error(`An error occurred while publishing the event`);
      throw new InternalServerErrorException(
        'An error on create transaction event.',
      );
    }
  }
}
