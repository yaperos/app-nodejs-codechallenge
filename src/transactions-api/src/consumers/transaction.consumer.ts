import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from 'src/handlers/commands/update-transaction.command';
import { KafkaConsumerService } from 'src/services/kafka-consumer.service';

@Injectable()
export class ValidatedTransactionsConsumer implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly consumerService: KafkaConsumerService,
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: this.configService
          .get('TRANSACTION_UPDATE_STATUS_TOPIC')
          .split(','),
      },
      {
        eachMessage: async ({ message, heartbeat }) => {
          await heartbeat();

          const payload = JSON.parse(message.value.toString());

          await this.commandBus.execute(
            new UpdateTransactionCommand(payload.id, payload.status),
          );
        },
      },
    );
  }
}
