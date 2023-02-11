/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionGraphqlDto } from './dto/create-transaction.graphql.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @Inject('TRANSACTION_MS') private readonly authClient: ClientProxy,
  ) {}

  async getTransacion(transactionId: string) {
    try {
      const transacionFound = await this.transactionRepository.findOne({
        where: { transactionId },
      });
      if (!transacionFound) {
        throw new HttpException(
          {
            message: 'La transacion no existe',
            error: '',
            type_error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const {
        accountExternalIdCredit,
        transactionType,
        status,
        value,
        createdAt,
      } = transacionFound;
      return {
        transactionExternalId: accountExternalIdCredit,
        transactionType: {
          name: transactionType,
        },
        transactionStatus: {
          name: status,
        },
        value,
        createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  helloWorld (): string {
    return ''
  }

  async saveTransactionGraphql(createUserDto: CreateTransactionGraphqlDto): Promise<TransactionEntity>  {
    try {
      const transactionId: string = uuid();
      const transaccionAdded = await this.saveTransactionDB(createUserDto, transactionId);
      this.authClient.emit(
        'transaction.validate',
        JSON.stringify({ transactionId, value: createUserDto.value }),
      );
      return transaccionAdded;
    } catch (error) {
      throw error;
    }
  }

  async saveTransaction(createUserDto: CreateTransactionDto) {
    try {
      const transactionId: string = uuid();
      this.saveTransactionDB(createUserDto, transactionId);
      this.authClient.emit(
        'transaction.validate',
        JSON.stringify({ transactionId, value: createUserDto.value }),
      );
      return createUserDto;
    } catch (error) {
      throw error;
    }
  }

  async validatedStatus(createTranDto: any) {
    const { transactionId, status } = createTranDto;
    status === 'approved'
      ? await this.updateStatusByIdTransaction(transactionId, 'approved')
      : await this.updateStatusByIdTransaction(transactionId, 'rejected');
  }

  async saveTransactionDB(
    transaction: CreateTransactionDto,
    transactionId: string,
  ): Promise<TransactionEntity> {
    try {
      const newTransaction = new TransactionEntity();
      newTransaction.transactionId = transactionId;
      newTransaction.accountExternalIdCredit =
        transaction.accountExternalIdCredit;
      newTransaction.accountExternalIdDebit =
        transaction.accountExternalIdDebit;
      newTransaction.transactionType = 'Transferencia';
      newTransaction.value = transaction.value;
      newTransaction.status = 'pending';
      newTransaction.createdAt = new Date();
      return await this.transactionRepository.save(newTransaction);
    } catch (error) {
      console.log('error ==> ', error);
      throw new HttpException(
        {
          message: 'NOT_CREATE_TRANSACTION',
          error: error.message,
          type_error: 'INSERT_DATABASE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatusByIdTransaction(transactionId: string, status: string) {
    try {
      await this.transactionRepository.update({ transactionId }, { status });
    } catch (error) {
      throw new HttpException(
        {
          message: 'NOT_UPDATE_TRANSACTION',
          error: error.message,
          type_error: 'UPDATE_DATABASE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
