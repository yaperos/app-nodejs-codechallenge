import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRANSACTION_STATES } from './constants/transactions';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './types/transactions.type';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_MICROSERVICE') private readonly antifraudClient: ClientKafka,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
  ) { }

  async createTransaction(transaction: TransactionType) {
    Logger.log(`💵 TRANSACTIONS-SERVICE: CREATING TRANSACTION`)
    try {
      const response = await this.transactionRepository.save({
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        value: transaction.value,
        transactionType: 'TRANSFER',
        state: TRANSACTION_STATES.PENDING
      });

      Logger.log(`💵 TRANSACTIONS-SERVICE: EMIT VALIDATION EVENT`)
      this.antifraudClient.emit('transaction.validate', JSON.stringify({ ...transaction, transactionExternalId: response.transactionExternalId }));

      Logger.log(`💵 TRANSACTIONS-SERVICE: FINISHING CREATE TRANSACTION`)
      return {
        transaction: response,
        message: 'La transacción ha sido creada con éxito',
      }
    } catch (error) {
      console.log(error);
      Logger.log(`🔴 TRANSACTIONS-SERVICE: ERROR ON CREATING TRANSACTION`)
      throw new HttpException('Ha ocurrido un error en la creación de la transacción', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllTransactions() {
    Logger.log(`💵 TRANSACTIONS-SERVICE: LIST`)
    const response = await this.transactionRepository.find();
    var transactions = [];
    if (response.length > 0) {
      transactions = response.map((t) => {
        return {
          transactionExternalId: t.transactionExternalId,
          transactionType: {
            name: t.transactionType
          },
          transactionStatus: {
            name: t.state
          },
          value: t.value,
          createdAt: t.createdAt
        }
      })
    }
    return {
      transactions,
      message: transactions.length == 0
        ? 'No existen transacciones registradas'
        : 'Lista de transacciones obtenida con éxito'
    }
  }

  async getTransactionById(id) {
    Logger.log(`💵 TRANSACTIONS-SERVICE: LIST ONE`)
    const response = await this.transactionRepository.findBy({ transactionExternalId: id });
    var transactions = [];
    if (response.length > 0) {
      transactions = response.map((t) => {
        return {
          transactionExternalId: t.transactionExternalId,
          transactionType: {
            name: t.transactionType
          },
          transactionStatus: {
            name: t.state
          },
          value: t.value,
          createdAt: t.createdAt
        }
      })
    }

    return {
      transaction: transactions.length > 0 ? transactions[0] : {},
      message: transactions.length > 0
        ? 'Transacción obtenida con éxito'
        : 'No se encontró la transacción solicitada'
    }
  }

  async approveTransaction(id) {
    Logger.log(`💵 TRANSACTIONS-SERVICE: UPDATING TRANSACTION`)
    try {
      await this.transactionRepository.update({ transactionExternalId: id }, { state: TRANSACTION_STATES.APPROVED });
      Logger.log(`💵 TRANSACTIONS-SERVICE: TRANSACTION APPROVED`)
    } catch (error) {
      console.log(error);
      Logger.log(`🔴 TRANSACTIONS-SERVICE: ERROR ON APPROVING TRANSACTION`)
      throw new HttpException('Ha ocurrido un error en la aprobación de la transacción', HttpStatus.BAD_REQUEST);
    }
  }

  async denyTransaction(id) {
    Logger.log(`💵 TRANSACTIONS-SERVICE: UPDATING TRANSACTION`)
    try {
      await this.transactionRepository.update({ transactionExternalId: id }, { state: TRANSACTION_STATES.DENIED });
      Logger.log(`💵 TRANSACTIONS-SERVICE: TRANSACTION DENIED`)
    } catch (error) {
      console.log(error);
      Logger.log(`🔴 TRANSACTIONS-SERVICE: ERROR ON DENYING TRANSACTION`)
      throw new HttpException('Ha ocurrido un error en la denegación de la transacción', HttpStatus.BAD_REQUEST);
    }
  }
}
