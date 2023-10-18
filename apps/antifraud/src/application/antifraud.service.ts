import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';

@Injectable()
export class AntifraudService {

  constructor(@Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka) { }

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('transaction.validated');
    await this.clientKafka.connect();
  }

  validateStatus(message: MessageBrokerDto<number>) {
    const isValid = message.data <= Number(process.env.LIMIT_TRANSACTION);
    this.clientKafka.emit('transaction.validated', this.buildMessageOutput(message.idTransaction, isValid));
  }

  private buildMessageOutput(id: string, isValid: Boolean): MessageBrokerDto<Boolean> {
    return {
      idTransaction: id,
      type: 'transaction_validated',
      date: new Date(),
      data: isValid,
    };
  }
}
