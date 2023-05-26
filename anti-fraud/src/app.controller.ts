import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Transaction } from './types/transaction';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'transaction-update'
      }
    }
  })
  client: ClientKafka;
  constructor(
  ) { }

  @MessagePattern(process.env.CREATED_TOPIC)
  async readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic:` + process.env.CREATED_TOPIC +
      JSON.stringify(originalMessage.value);
    console.log(response)
    const transaction = message as Transaction
    if (transaction.value > 1000) {
      return this.client.emit(process.env.REJECTED_TOPIC, JSON.stringify(transaction))
    } else {
      return this.client.emit(process.env.APPROVED_TOPIC, JSON.stringify(transaction))
    }
  }
}
