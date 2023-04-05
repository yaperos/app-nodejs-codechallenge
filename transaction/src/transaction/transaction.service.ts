import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';
import { TransactionStatus } from './enum/transaction-status.enum';
import { ITransaction } from './interface/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject('KAFKA') private readonly kafkaClient: ClientProxy,
  ) {}

  async listTransactions(): Promise<ITransaction[]> {
    const transactions: Transaction[] = await this.transactionRepository.find({
      select: ['id', 'status', 'value', 'createdAt', 'tranferTypeId'],
    });

    const transactionList = transactions.map((transaction: Transaction) => ({
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.tranferTypeId },
      transactionStatus: { name: transaction.status },
      value: transaction.value,
      createdAt: transaction.createdAt,
    }));

    return transactionList;
  }

  async createTransaction(body: CreateTransactionDto): Promise<void> {
    const transaction = new Transaction();
    transaction.id = uuid();
    transaction.status = TransactionStatus.PENDING;
    transaction.tranferTypeId = body.tranferTypeId;
    transaction.value = body.value;
    transaction.accountExternalIdCredit = body.accountExternalIdCredit;
    transaction.accountExternalIdDebit = body.accountExternalIdDebit;
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    console.log('Enviando mensaje al servidor Kafka...');
    this.kafkaClient.emit('transaction_created', { a: 1, b: 2 }).subscribe({
      next: (data) => console.log('Mensaje enviado al servidor Kafka:', data),
      error: (err) => console.log('Error al enviar al servidor Kafka:', err),
      complete: () => console.log('Conexión al servidor Kafka cerrada.'),
    });
  }
}
