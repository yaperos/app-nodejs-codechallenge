import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface
{
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async sendRejected(id: number, message: string): Promise<boolean> {
    const sended = await this.kafka.emit(
      'reject_transaction',
      JSON.stringify({ id, message }),
    );
    return sended ? true : false;
  }
  async sendApproved(id: number, message: string): Promise<boolean> {
    const sended = await this.kafka.emit(
      'approve_transaction',
      JSON.stringify({ id, message }),
    );
    return sended ? true : false;
  }
}
