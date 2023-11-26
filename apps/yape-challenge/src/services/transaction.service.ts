import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityNotFoundError, Repository } from 'typeorm';
import { TransaccionEntity } from '../entities';
import { TransaccionDto } from '../dto';
import { TransactionStatusDTO } from '../enums';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransaccionEntity)
    private transactionRepository: Repository<TransaccionEntity>,
    @Inject('TRANSACTION_KAFKA')
    private readonly kafka: ClientProxy,
  ) {}

  /**
   * The function getAllTransaction returns all transactions from the transaction repository.
   * @returns a Promise that resolves to an array of TransaccionEntity objects.
   */
  async getAllTransaction(): Promise<TransaccionEntity[]> {
    return this.transactionRepository.find();
  }

  /**
   * The function `getTransaction` retrieves a transaction entity from the database based on the provided
   * transaction ID.
   * @param {string} transactionId - The `transactionId` parameter is a string that represents the unique
   * identifier of a transaction. It is used to search for a transaction in the `transactionRepository`
   * and retrieve the corresponding `TransaccionEntity` object.
   * @returns The `getTransaction` function is returning the `transactionFound` object, which is of type
   * `TransaccionEntity`.
   */
  async getTransaction(transactionId: string): Promise<TransaccionEntity> {
    const transactionFound = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.tranferTypeId', 'type')
      .leftJoinAndSelect('transaction.transactionStatus', 'status')
      .where({ transactionId })
      .getOne();

    return transactionFound;
  }

  /**
   * The function `newTransaction` creates a new transaction with the provided details and returns the
   * created transaction.
   * @param {TransaccionDto} body - The `body` parameter is an object of type `TransaccionDto` which
   * contains the following properties:
   * @returns a Promise that resolves to a TransaccionEntity object.
   */
  async newTransaction(body: TransaccionDto): Promise<TransaccionEntity> {
    const {
      accountExternalIdCredit,
      accountExternalIdDebit,
      tranferTypeId,
      value,
    } = body || {};
    try {
      const newTransaction = this.transactionRepository.create({
        accountExternalIdCredit,
        accountExternalIdDebit,
        transactionStatus: { id: TransactionStatusDTO.PENDING },
        tranferTypeId: { id: tranferTypeId },
        value,
      });

      const transactionCreated =
        await this.transactionRepository.save(newTransaction);

      this.emitMessage(transactionCreated);

      return transactionCreated;
    } catch (err) {
      throw new Error(`Error when creating the transaction: ${err}`);
    }
  }

  /**
   * The function `emitMessage` sends a message using Kafka with the provided `transactionCreated`
   * object.
   * @param {TransaccionEntity} transactionCreated - The parameter `transactionCreated` is of type
   * `TransaccionEntity`.
   */
  async emitMessage(transactionCreated: TransaccionEntity): Promise<void> {
    try {
      this.kafka
        .emit('create-transaction', { transactionCreated })
        .pipe()
        .subscribe();
    } catch (error) {
      throw new Error(`Error when send message: ${error}`);
    }
  }

  /**
   * The function `updateStatusTransaction` updates the status of a transaction with the given
   * transaction ID.
   * @param {string} transactionId - A string representing the ID of the transaction to be updated.
   * @param {number} status - The `status` parameter is a number that represents the new status of the
   * transaction.
   * @returns a Promise that resolves to a TransaccionEntity object.
   */
  async updateStatusTransaction(
    transactionId: string,
    body: { status: number },
  ): Promise<TransaccionEntity> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { transactionId: transactionId },
      });

      this.transactionRepository.merge(transaction, {
        transactionStatus: { id: body.status },
      });

      return this.transactionRepository.save(transaction);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(`Transaction ID: ${transactionId} not found`);
      }

      throw new Error(`Error updating data: ${error.message}`);
    }
  }

  /**
   * The DeleteTransaction function clears all transactions from the transaction repository.
   */
  async DeleteTransaction(): Promise<void> {
    await this.transactionRepository.clear();
  }
}
