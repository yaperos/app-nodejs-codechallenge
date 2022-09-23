import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, KafkaRetriableException } from '@nestjs/microservices';
import { ANTI_FRAUD_SERVICE, TRANSACTION_SERVICE } from './constans/services';
import { CreateTransactionDto } from './dto/create-trasaction.dto';
import { TransactionRepository } from './transaction.repository';
import { lastValueFrom } from 'rxjs';
import { Transaction } from './entity/transaction.entity';
import { START_TRANSACTION_VALIDATED } from '@app/common/constans/topics';
import { AntiFraud, RequestData } from '@app/common/interfaces';
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject(ANTI_FRAUD_SERVICE) private antiFraudClient: ClientKafka,
    @Inject(TRANSACTION_SERVICE) private transactionClient: ClientKafka,
  ) {}

  async create(transactionDto: CreateTransactionDto) {
    try {
      return this.transactionRepository.create(transactionDto);
    } catch (error) {
      throw new KafkaRetriableException('Error al crear Transacion');
    }
  }

  async findOne(transactionExternalId: string) {
    try {
      return this.transactionRepository.findOne(transactionExternalId);
    } catch (error) {
      throw new KafkaRetriableException('Error al crear Transacion');
    }
  }

  async updateStatus(antiFraud: AntiFraud) {
    try {
      const transaction = await this.transactionRepository.updateStatusById(
        antiFraud.transactionId,
        antiFraud.status,
      );
      return transaction;
    } catch (error) {
      throw new KafkaRetriableException('Error actualizar Transacion');
    }
  }

  async emitTransactionToAntiFraud(transaction: Transaction) {
    await lastValueFrom(
      this.antiFraudClient.emit<string, RequestData<AntiFraud>>(
        START_TRANSACTION_VALIDATED,
        {
          payload: {
            status: transaction.status,
            transactionId: transaction.id,
            value: transaction.value,
          },
        },
      ),
    );
  }
}
