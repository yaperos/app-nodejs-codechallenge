import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { NewTransactionInput } from './inputs/new-transaction.input';
import { UserCardService } from 'src/user-cars/user-card.service';
import { UsersService } from 'src/users/users.service';
import {
  StatusTransaction,
  CurrencyType,
  PaymentMethodType,
} from 'src/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { DataTransactionDto } from 'src/common/dtos';
import { GetTransactionInput } from './inputs/get-transaction.input';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
    private readonly _userCardService: UserCardService,
    private readonly _userService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly _clientKafka: ClientKafka,
  ) {}

  async getTransactions(
    data: GetTransactionInput,
  ): Promise<TransactionEntity[]> {
    const queryBuilder =
      this._transactionRepository.createQueryBuilder('transaction');

    queryBuilder
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.userCard', 'userCard')
      .leftJoinAndSelect('userCard.cardType', 'cardType');

    if (data.transactionId) {
      queryBuilder.where('transaction.id = :transactionId', {
        transactionId: data.transactionId,
      });
    }

    if (data.status) {
      queryBuilder.andWhere('transaction.status = :status', {
        status: data.status,
      });
    }

    if (data.amount) {
      queryBuilder.andWhere('transaction.amount = :amount', {
        amount: data.amount,
      });
    }

    if (data.cardId) {
      queryBuilder.andWhere('userCard.id = :cardId', {
        cardId: data.cardId,
      });
    }

    if (data.cardTypeName) {
      queryBuilder.andWhere('cardType.name ILIKE :cardTypeName', {
        cardTypeName: `%${data.cardTypeName}%`,
      });
    }

    if (data.createdAt) {
      queryBuilder.andWhere('transaction.createdAt > :createdAt', {
        createdAt: moment(data.createdAt).format('YYYY-MM-DD'),
      });
    }

    return await queryBuilder.getMany();
  }

  async newTransaction(
    data: NewTransactionInput,
    userId: string,
  ): Promise<TransactionEntity> {
    try {
      const userCard = await this._userCardService.findOneByID(data.cardId);

      if (!userCard)
        throw new HttpException(
          `Card ID: ${data.cardId} not found`,
          HttpStatus.NOT_FOUND,
        );

      if (userId != userCard.user.id)
        throw new HttpException(
          `Card ID: ${data.cardId} does not belong to your user`,
          HttpStatus.BAD_REQUEST,
        );

      const user = await this._userService.findOneByID(userId);

      if (!user)
        throw new HttpException(
          `User ID: ${userId} not found`,
          HttpStatus.NOT_FOUND,
        );

      const transaction = new TransactionEntity();
      transaction.amount = data.amount;
      transaction.status = StatusTransaction.PENDING;
      transaction.user = user;
      transaction.userCard = userCard;

      const resp = await this._transactionRepository.save(transaction);

      const dataTransaction: DataTransactionDto = new DataTransactionDto();
      dataTransaction.stripePaymentMethodId = userCard.stripePaymentMethodId;
      dataTransaction.stripeCostumerId = user.stripeCostumerId;
      dataTransaction.currency = CurrencyType.USD;
      dataTransaction.paymentMethodType = PaymentMethodType.CARD;
      dataTransaction.amount = transaction.amount;
      dataTransaction.transactionId = resp.id;

      this._clientKafka.emit('topic.yape', JSON.stringify(dataTransaction));
      return resp;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateStatusTransaction(data: any): Promise<void> {
    try {
      const transaction = await this.findOneByID(data.transactionId);
      if (transaction) {
        if (data.status == 'succeeded') {
          transaction.status = StatusTransaction.APPROVED;
        } else if(data.status == StatusTransaction.REJECTED) {
          transaction.status = StatusTransaction.REJECTED;
        }
        await this._transactionRepository.save(transaction);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<TransactionEntity> {
    return await this._transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.id = :id', { id: id })
      .getOne();
  }
}
