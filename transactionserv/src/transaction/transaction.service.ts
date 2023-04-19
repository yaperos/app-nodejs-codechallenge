import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import { KafkaClient } from './kafka/kafka-client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import { Transaction } from './entities/transaction.entity';
import { YapeTransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionWithGraphql } from './dto/create-transaction-graphql';

// Imports

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(YapeTransactionType)
    private readonly transactionTypeRepository: Repository<YapeTransactionType>,
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: KafkaClient,
  ) {}

  async onModuleInit() {
    this.listenToTransactionCreated();
  }

  // Estado por default

  async getDefaultTransactionStatus(): Promise<TransactionStatus> {
      return await this.transactionStatusRepository.findOne({ where: { id: 1 } });
    }

  // Creacion de transacciones y validaciones

  async create(createTransactionDto: CreateTransactionDto): Promise<any> {
    const transactionType = await this.getTransactionTypeById(
      createTransactionDto.transferTypeId,
    );

    if (!transactionType) {
      throw new NotFoundException('Tipo de transacción no encontrado');
    }

    const transactionData: DeepPartial<Transaction> = {
      accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
      accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
      transferType: transactionType,
      value: createTransactionDto.value,
    };

    const transaction = this.transactionRepository.create(transactionData);

    const transactionId = uuidv4();
    transaction.transactionExternalId = transactionId;
    transaction.transactionStatus = await this.getDefaultTransactionStatus();
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    await this.kafkaClient.sendMessage({
      topic: 'transaction_created',
      key: transactionId,
      value: JSON.stringify({
        transactionExternalId: transactionId,
        value: transaction.value,
      }),
    });

    return {
      message: 'Transacción Creada',
      transactionId: transactionId,
    };
  }

  // Obtencionon de transaccion por ID

  async getTransactionTypeById(id: number): Promise<YapeTransactionType> {
    try {
      return await this.transactionTypeRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(`Error al buscar el TransactionType con ID ${id}: ${error}`);
      throw new NotFoundException(`TransactionType con ID ${id} no encontrado`);
    }
  }
  

  async findOneByTransactionExternalId(
    transactionExternalId: string,
  ): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transferType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    const formattedTransaction = {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transferType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: format(transaction.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS'),
    };

    return formattedTransaction;
  }

  // Escucha de transaccion creada

  async listenToTransactionCreated() {
    await this.kafkaClient.consumeMessage(
      'transaction_validation_result',
      (messageData) => {
        console.log('Mensaje recibido en TransactionService:', messageData);

        const { transactionExternalId, result } = messageData;
        try {
          this.updateTransactionStatus(transactionExternalId, result);
          console.log('Estatus de transacción actualizado');
        } catch (error) {
          console.error('Ha ocurrido un error actualizando el estado de la transacción:', error.message);
        }
      },
    );
  }

  // Actualizacion de estado de la transaccion

  async updateTransactionStatus(
    transactionExternalId: string,
    newStatusName: string,
  ): Promise<void> {
    const newStatus = await this.transactionStatusRepository.findOne({
      where: { name: newStatusName },
    });

    if (!newStatus) {
      throw new Error(`Status '${newStatusName}' not found`);
    }

    await this.transactionRepository.update(
      { transactionExternalId },
      { transactionStatus: newStatus },
    );
  }

  // Implementacion de GraphQl

  async createWithGraphql(
    createTransaction: CreateTransactionWithGraphql,
  ): Promise<Transaction> {
    const transactionType = await this.getTransactionTypeById(
      createTransaction.transferTypeId,
    );

    if (!transactionType) {
      throw new NotFoundException('Tipo de transacción no encontrado');
    }

    const transactionData: DeepPartial<Transaction> = {
      accountExternalIdDebit: createTransaction.accountExternalIdDebit,
      accountExternalIdCredit: createTransaction.accountExternalIdCredit,
      transferType: transactionType,
      value: createTransaction.value,
    };
    const transaction = this.transactionRepository.create(transactionData);

    const transactionId = uuidv4();
    transaction.transactionExternalId = transactionId;
    transaction.transactionStatus = await this.getDefaultTransactionStatus();
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    await this.kafkaClient.sendMessage({
      topic: 'transaction_created',
      key: transactionId,
      value: JSON.stringify({
        transactionExternalId: transactionId,
        value: transaction.value,
      }),
    });

    return transaction;
  }

  // Obtencion de transaccion por ID con GraphQl

  async findOneByTransactionExternalIdWithGraphql(
    transactionExternalId: string,
  ): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transferType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    return transaction;
  }
}