import { Producer } from 'kafkajs';

import { Logger } from '../../common/types';
import { TransactionStatus } from '../repositories/domain/transaction.domain';
import { TransactionRepository } from '../repositories/transaction.repository';

export interface TransactionCreateCommandInput {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export class TransactionCreateCommand {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly producer: Producer,
    private readonly logger: Logger,
  ) {}

  async handle(input: TransactionCreateCommandInput) {
    this.logger.debug(
      `Trying to create new transaction for ${input.accountExternalIdCredit}:${input.accountExternalIdDebit}`,
    );

    const lastTransactionId = await this.transactionRepository.create({
      status: TransactionStatus.PENDING,
      accountExternalIdCredit: input.accountExternalIdCredit,
      accountExternalIdDebit: input.accountExternalIdDebit,
      tranferTypeId: input.tranferTypeId,
      value: input.value,
      createdAt: new Date(),
    });

    this.producer.send({
      topic: 'validate-transaction',
      messages: [
        {
          value: lastTransactionId.toHexString(),
        },
      ],
    });

    this.logger.debug(
      `New transaction has been succesfuly created: ${lastTransactionId}`,
    );

    return lastTransactionId;
  }
}
