import { ConfigService } from '@nestjs/config';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

/* Project */
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './models';
import { UpdateTransactionStatusCommand } from './commands/impl/update-transaction-status.command';
import { Queries } from './queries';
import { Commands } from './commands';
import {
  TRANSACTION_REPOSITORY,
  TypeormTransactionRepository,
} from './repositories';
import { TransactionTypeModule } from '../transaction_types';
import { KafkaModule } from '../../common/kafka';
import { KafkaService } from '../../common/kafka/kafka.service';
import { ValidatedTransactionRequestDto } from './dtos';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([TransactionEntity]),
    KafkaModule,
    TransactionTypeModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ...Queries,
    ...Commands,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TypeormTransactionRepository,
    },
  ],
})
export class TransactionModule implements OnModuleInit {
  private readonly logger = new Logger(TransactionModule.name);
  private readonly topic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    private readonly commandBus: CommandBus,
  ) {
    this.topic = this.configService.get('KAFKA_TRANSACTIONS_VALIDATED_TOPIC')!;
  }

  onModuleInit() {
    this.kafkaService.registerListener(this.topic, async (payload) => {
      const raw = payload.message.value?.toString() || '';
      this.logger.log(`📦 Event on ${this.topic}: ${raw}`);

      const parsedRaw = JSON.parse(raw) as ValidatedTransactionRequestDto;

      await this.commandBus.execute(
        new UpdateTransactionStatusCommand(parsedRaw),
      );
    });
  }
}
