import { Inject } from '@nestjs/common';
import { ApplicationService } from '../domain/interfaces/application-service';
import { TRANSACTION_REPOSITORY } from '../infrastructure/constants/injection-tokens';
import { ITransactionRepository } from '../domain/interfaces/transaction-repository';
import { IFindTransaction } from '../domain/interfaces/find-transaction';
import { TransactionResponseDto } from '../infrastructure/dtos/transaction-detail.dto';
import { TransactionTypeEnum } from '../domain/enums/transaction-type.enum';
import { StatusTransactions } from '../domain/enums/status.enum';

export class FindTransaction implements ApplicationService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async process(
    command: IFindTransaction,
  ): Promise<TransactionResponseDto> {
    const { id } = command;
    const data = await this.transactionRepository.findById(id);
    const response: TransactionResponseDto = {
      transactionExternalId: id,
      transactionType: {
        name: TransactionTypeEnum[data.tranferTypeId],
      },
      transactionStatus: {
        name: StatusTransactions[data.status.toUpperCase()],
      },
      createdAt: data.createdAt.toString(),
      value: data.value,
    };
    return response;
  }
}
