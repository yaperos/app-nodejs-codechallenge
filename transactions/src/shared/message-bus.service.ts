import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TRANSACTION_CREATED } from '@transactions/domain/transaction.event';

@Injectable()
export class MessageBus<T, K> implements OnModuleInit {
  constructor(@Inject('ANTIFRAUD_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf(TRANSACTION_CREATED);
    await this.client.connect();
  }

  public async send(topic: string, payload: T): Promise<K> {
    return new Promise((resolve) => {
      this.client
        .send(topic, JSON.stringify(payload))
        .subscribe((response: K) => resolve(response));
    });
  }
}
