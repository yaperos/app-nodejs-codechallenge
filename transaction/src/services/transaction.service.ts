import { ITransactionRequest } from '../interfaces/transaction.interface';
import { KafkaClient } from '../kafka/kafka.client';
import { Transaction, TransactionStatus } from '../models/transaction.model';
import { TransactionRepository } from '../repository/transaction.repository';
import { uuidGenerator } from '../shared/uuid-generator';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private kafkaClient: KafkaClient;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.kafkaClient = new KafkaClient();
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.transactionRepository.findOne(transactionId);
    return transaction;
  }

  async createTransaction(body: ITransactionRequest) {
    const newTransactionId = uuidGenerator();

    const data: Transaction = {
      id: newTransactionId,
      transferTypeId: body.transferTypeId,
      value: body.value,
      status: TransactionStatus.pending,
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
    };

    await this.transactionRepository.insert(data);

    await this.kafkaClient.sendMessage(JSON.stringify(data));

    return data;
  }
}
