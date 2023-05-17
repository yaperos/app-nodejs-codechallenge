import { Inject, Injectable } from '@nestjs/common';
import { CreateAntiFraudServiceDto } from './dto/create-anti-fraud-service.dto';
import {
  ITransaction,
  Transaction,
} from './entities/transaction.service.entity';
import { Observer } from './Observer/transation.observer';
import { ClientKafka } from '@nestjs/microservices';
import { logger } from 'datadog';

@Injectable()
export class AntiFraudServiceService implements Observer {
  constructor(
    @Inject('any_name_i_want') private readonly client: ClientKafka,
  ) {}

  create(createAntiFraudServiceDto: CreateAntiFraudServiceDto) {
    logger.log('info', {
      message: 'create transaction check',
      createAntiFraudServiceDto,
    });
    const transaction = new Transaction(createAntiFraudServiceDto);

    const antiFraudService = new AntiFraudServiceService(this.client);
    transaction.attach(antiFraudService);
    transaction.setStatus('pending');
  }

  update(transaction: Transaction): void {
    const value = transaction.value;

    let transactionToSend: ITransaction = {
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      tranferTypeId: transaction.tranferTypeId,
      value: transaction.value,
      transactionExternalId: transaction.transactionExternalId,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
    };

    if (transaction.transactionStatus === 'pending') {
      if (value < 1000) {
        transaction.setStatus('approved');
        const status = transaction.getStatus();
        transactionToSend = {
          ...transactionToSend,
          transactionStatus: status,
        };
        this.publish('transactions.approved', transactionToSend);
      } else {
        transaction.setStatus('rejected');
        transactionToSend = {
          ...transactionToSend,
          transactionStatus: transaction.getStatus(),
        };
        this.publish('transactions.rejected', transactionToSend);
      }
    }
  }

  private publish(topic: string, transaction: ITransaction) {
    logger.log('info', { topic, transaction });
    this.client.emit(topic, JSON.stringify({ ...transaction }));
  }
}
