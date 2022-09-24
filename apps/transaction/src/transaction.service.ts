import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  private readonly transactionTypes = [
    {
      id: 1,
      name: 'visa',
    },
    {
      id: 2,
      name: 'mastercard',
    },
  ];

  findTransactionTypeById(id: number) {
    return this.transactionTypes.find((type) => type.id === id);
  }

  async create(transactionDto: CreateTransactionDto) {
    const transactionType = this.findTransactionTypeById(
      transactionDto.tranferTypeId,
    );
    if (!transactionType) {
      throw new NotFoundException(
        'TransactionType not found with tranferTypeId:' +
          transactionDto.tranferTypeId,
      );
    }

    try {
      const transaction = await this.transactionRepository.create(
        transactionDto,
      );
      return { transaction, transactionType };
    } catch (error) {
      throw new KafkaRetriableException('Error al crear Transacion');
    }
  }

  async findOne(transactionExternalId: string) {
    try {
      const transaction = await this.transactionRepository.findOne(
        transactionExternalId,
      );
      const transactionType = this.findTransactionTypeById(
        transaction.tranferTypeId,
      );

      if (!transaction) {
        throw new NotFoundException(
          'Transaction not found with guid: ' + transactionExternalId,
        );
      }
      return { transaction, transactionType };
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
            transactionId: transaction.transactionExternalId,
            value: transaction.value,
          },
        },
      ),
    );
  }
}
