import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionResponse } from 'src/common/transaction.type';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from 'src/dto/transaction.dto';
import { Transaction } from 'src/entities/transaction';
import { TransactionEvent } from 'src/events/transaction.event';
import { transactionMapper } from 'src/mappers/transaction.mapper';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import { TransferTypeRepository } from 'src/repositories/transferType.repository';
import { UserAccountRepository } from 'src/repositories/userAccount.repository';
import { randomUUID } from 'src/utils/uuid';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionEvent: TransactionEvent,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly transferTypeRepository: TransferTypeRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  /**
   *
   * @param createPickingDto
   * @returns {Promise<TransactionResponse>}
   */
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    const { accountExternalIdCredit, accountExternalIdDebit, transferTypeId } =
      createTransactionDto;

    const [accounts, transferType] = await Promise.all([
      this.userAccountRepository.getByIds([
        accountExternalIdCredit,
        accountExternalIdDebit,
      ]),
      this.transferTypeRepository.getById(transferTypeId),
    ]);

    if (accounts.length !== 2) {
      throw new BadRequestException('External accounts are invalid');
    }

    if (!transferType) {
      throw new BadRequestException('Transfer type invalid');
    }

    const transactionExternalId = randomUUID();

    let transaction = new Transaction({
      transactionExternalId,
      ...createTransactionDto,
      transferType,
    });

    transaction = await this.transactionRepository.save(transaction);

    this.transactionEvent.created(transaction);

    return transactionMapper(transaction);
  }

  async update(updateTransactionDto: UpdateTransactionDto): Promise<void> {
    const { transactionExternalId, status } = updateTransactionDto;
    const transaction = await this.transactionRepository.findOneBy({
      transactionExternalId,
    });

    transaction.status = status;
    transaction.updatedAt = new Date();
    await this.transactionRepository.update(transactionExternalId, transaction);
  }
}
