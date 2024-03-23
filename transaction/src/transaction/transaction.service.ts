import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionWithGraphql } from './dto/create-transaction-graphql';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { KafkaClient } from './kafka/kafka-client.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: KafkaClient,
  ) {}

  async onModuleInit() {
    this.listenToTransactionCreated();
  }

  //creando una transacción
  async create(createTransactionDto: CreateTransactionDto): Promise<any> {
    const transactionType = await this.getTransactionTypeById(
      createTransactionDto.transferTypeId,
    );

    if (!transactionType) {
      throw new NotFoundException('Transaction type not found');
    }

    const transactionData: DeepPartial<Transaction> = {
      accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
      accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
      transferType: transactionType,
      value: createTransactionDto.value,
    };

    const transaction = this.transactionRepository.create(transactionData);

    // Establece valores predeterminados para las columnas faltantes
    const transactionId = uuidv4();
    transaction.transactionExternalId = transactionId;
    transaction.transactionStatus = await this.getDefaultTransactionStatus();
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    // Envía un mensaje a Kafka
    await this.kafkaClient.sendMessage({
      topic: 'transaction_created',
      key: transactionId,
      value: JSON.stringify({
        transactionExternalId: transactionId,
        value: transaction.value,
      }),
    });

    return {
      message: 'Transacción creada',
      transactionId: transactionId,
    };
  }

  // retorna el objeto TransactionStatus de la tabla status con id 1
  async getDefaultTransactionStatus(): Promise<TransactionStatus> {
    return await this.transactionStatusRepository.findOne({ where: { id: 1 } });
  }

  // retorna el objeto TransactionType de la tabla tipos por id
  async getTransactionTypeById(id: number): Promise<TransactionType> {
    return await this.transactionTypeRepository.findOne({ where: { id } });
  }

  //Obtener una transacción por su transactionExternalId
  async findOneByTransactionExternalId(
    transactionExternalId: string,
  ): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transferType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
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

  //recibe la respuesta de parte del servicio anti-fraude
  async listenToTransactionCreated() {
    await this.kafkaClient.consumeMessage(
      'transaction_validation_result',
      (messageData) => {
        console.log('Mensaje recibido en TransactionService:', messageData);

        const { transactionExternalId, result } = messageData;
        try {
          this.updateTransactionStatus(transactionExternalId, result);
          console.log('Transaction status updated');
        } catch (error) {
          console.error('Error updating transaction status:', error.message);
        }
      },
    );
  }

  //actualiza el estado de la transacción en la base de datos
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

  // Mismas funciones pero ahora Usando GRAPHQL

  async createWithGraphql(
    createTransaction: CreateTransactionWithGraphql,
  ): Promise<Transaction> {
    const transactionType = await this.getTransactionTypeById(
      createTransaction.transferTypeId,
    );

    if (!transactionType) {
      throw new NotFoundException('Transaction type not found');
    }

    const transactionData: DeepPartial<Transaction> = {
      accountExternalIdDebit: createTransaction.accountExternalIdDebit,
      accountExternalIdCredit: createTransaction.accountExternalIdCredit,
      transferType: transactionType,
      value: createTransaction.value,
    };
    const transaction = this.transactionRepository.create(transactionData);

    // Establece valores predeterminados para las columnas faltantes
    const transactionId = uuidv4();
    transaction.transactionExternalId = transactionId;
    transaction.transactionStatus = await this.getDefaultTransactionStatus();
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    // Envía un mensaje a Kafka
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

  async findOneByTransactionExternalIdWithGraphql(
    transactionExternalId: string,
  ): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transferType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
