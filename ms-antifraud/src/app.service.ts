import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transClient: ClientKafka,
  ) {}
  validateTransaction(data: CreateTransactionDto) {
    try {
      let status: string;
      if (data.value > 1000) {
        status = 'REJECTED';
      } else {
        status = 'APPROVED';
      }

      console.log(status);
      this.transClient.emit(
        'update_transaction',
        JSON.stringify({ id: data.id, status }),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
