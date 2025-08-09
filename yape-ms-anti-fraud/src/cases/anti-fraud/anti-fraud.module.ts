import { ConfigService } from '@nestjs/config';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

/* Project */
import { KafkaModule, KafkaService } from '../../common/kafka';
import { AntiFraudController } from './anti-fraud.controller';
import { Commands, ValidateTransactionCommand } from './commands';
import { TransactionRequestDto } from './dtos/transaction.dto';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  controllers: [AntiFraudController],
  imports: [KafkaModule, CqrsModule],
  providers: [AntiFraudService, ...Commands],
})
export class AntiFraudModule implements OnModuleInit {
  private readonly logger = new Logger(AntiFraudModule.name);
  private readonly topic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    private readonly commandBus: CommandBus,
  ) {
    this.topic = this.configService.get<string>('KAFKA_TRANSACTIONS_TOPIC')!;
  }

  onModuleInit() {
    this.kafkaService.registerListener(this.topic, async (payload) => {
      const raw = payload.message.value?.toString() || '';
      this.logger.log(`📦 Event on ${this.topic}: ${raw}`);

      const parsedRaw = JSON.parse(raw) as TransactionRequestDto;

      await this.commandBus.execute(new ValidateTransactionCommand(parsedRaw));
    });

    this.logger.log(`📡 Listener registered for topic: ${this.topic}`);
  }
}
