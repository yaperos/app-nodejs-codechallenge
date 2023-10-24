import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessageBrokerDto } from './dto/message-broker.dto';

@Injectable()
export class AntifraudService {

    constructor(
        @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka
    ) {}

    async onModuleInit() {
        this.clientKafka.subscribeToResponseOf('transaction.validated');
        await this.clientKafka.connect();
    }

  validateStatus(content: any) {
    try {
        const isValid = content.value <= Number(process.env.LIMIT_TRANSACTION);
        this.clientKafka.emit('transaction.validated', this.buildMessageOutput(content.id, isValid));
    } catch (error) {
        console.error('error validating transaction', error)
    }
    
  }

  private buildMessageOutput(id: string, isValid: Boolean): MessageBrokerDto<Object> {
    return {
      type: 'transaction_validated',
      date: new Date(),
      content: {
        id,
        isValid,
      }
    };
  }
}