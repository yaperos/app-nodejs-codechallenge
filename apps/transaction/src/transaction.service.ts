import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ANTI_FRAUD_SERVICE } from './constans/services';
import { CreateTransactionDto } from './dto/create-trasaction.dto';
import { TransactionRepository } from './transaction.repository';
import {lastValueFrom} from 'rxjs'
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject(ANTI_FRAUD_SERVICE) private antiFraudClient: ClientProxy,
  ) {}

  async createTransaction(request: CreateTransactionDto) {
    try {
      const transaction = await this.transactionRepository.create(request);
      await lastValueFrom(
        this.antiFraudClient.emit('transaction_created',{
          request,
          
        })
      )
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear Transacion');
    }
  }
}
