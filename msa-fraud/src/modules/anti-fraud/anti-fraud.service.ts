import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AntiFraudUpdate,
  CreateAntiFraudDto,
} from './dto/create-anti-fraud.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatus } from '../../constants/transaction.const';
import { firstValueFrom } from 'rxjs';
import { KAFKA_TRANSACTION_UPDATE } from '../../config/kafka.config';

@Injectable()
export class AntiFraudService {
  private logger = new Logger(AntiFraudService.name);

  constructor(
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  async create(createAntiFraudDto: CreateAntiFraudDto): Promise<void> {
    const messageValue: AntiFraudUpdate = {
      id: createAntiFraudDto.id,
      status:
        createAntiFraudDto.amount > 1000
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED,
    };
    this.logger.log(KAFKA_TRANSACTION_UPDATE, messageValue);
    try {
      await firstValueFrom(
        this.kafka.emit(KAFKA_TRANSACTION_UPDATE, messageValue),
      );
    } catch (err) {
      this.logger.error(KAFKA_TRANSACTION_UPDATE, err);
    }
  }
}
