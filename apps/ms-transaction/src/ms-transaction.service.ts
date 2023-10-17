import { MessageTransactionDto, Transaction } from '@app/core-library';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MsTransactionService {
  private readonly logger = new Logger(MsTransactionService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async update(messageTransactionDto: MessageTransactionDto) {
    this.logger.log('-- init update --');
    this.logger.log(JSON.stringify(messageTransactionDto));

    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: messageTransactionDto.transactionExternalId,
      },
      relations: {
        transactionStatus: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction #${messageTransactionDto.transactionExternalId} not found`,
      );
    }

    const transactionUpdate = await this.transactionRepository.preload({
      id: transaction.id,
      transactionStatusId: messageTransactionDto.transactionStatusId,
    });

    return this.transactionRepository.save(transactionUpdate);
  }
}
