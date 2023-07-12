import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import Transaction from 'src/domain/transaction';
import { Optional } from 'typescript-optional';
import { GetTransactionDto } from '../dtos/getTransaction.dto';

@Injectable()
export default class GetTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
  ) {}

  public async handler(transactionId: string): Promise<GetTransactionDto> {
    const transaction = await this.transactionRepository.getTransaction(
      transactionId,
    );
    const transactionResponse = {
      transactionExternalId: transaction.get().getTransactionId(),
      transactionType: {
        name: 'financial',
      },
      transactionStatus: {
        name: transaction.get().getStatus(),
      },
      value: transaction.get().getValue(),
      createdAt: transaction.get().getCreatedAt(),
    };
    return transactionResponse;
  }
}
