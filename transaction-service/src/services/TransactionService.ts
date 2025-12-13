import { ITransactionService } from './ITransactionService';
import { Transaction } from '../entities/Transaction';
import { AppDataSource } from '../config/data-source';
import { TransactionStatus } from '../entities/TransactionStatus';
import { TransactionStatusName } from '../enum/TransactionStatusName';
import { TransactionEventService } from './TransactionEventService';

export class TransactionService implements ITransactionService {


  // Rgistrar la transacción
  async createTransaction(data: { accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  }): Promise<Transaction> {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const statusRepo = AppDataSource.getRepository(TransactionStatus);
    const transactionEventService = new TransactionEventService();
    // Buscar el id del estado 'pending' usando el enum
    const pendingStatus = await statusRepo.findOne({ where: { name: TransactionStatusName.Pending } });
    if (!pendingStatus) throw new Error('Estado inicial "pending" no encontrado');
    const transaction = transactionRepo.create({
      ...data,
      transactionStatus: { id: pendingStatus.id },
      transactionType: { id: data.transferTypeId },
    });
    const savedTransaction = await transactionRepo.save(transaction);
    // Emitir evento a Kafka
    await transactionEventService.emitTransactionCreated({
      transactionExternalId: savedTransaction.transactionExternalId,
      value: savedTransaction.value
    });
    return savedTransaction;
  }

  //Obtener transacción por ID externo
  async getTransactionById(transactionExternalId: string): Promise<Transaction | null> {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    return await transactionRepo.findOne({
      where: { transactionExternalId },
      relations: ['transactionType', 'transactionStatus'],
    });
  }
  
  async updateTransactionStatus(transactionExternalId: string, status: TransactionStatusName): Promise<Transaction | null> {
   
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const statusRepo = AppDataSource.getRepository(TransactionStatus);
    const transaction = await transactionRepo.findOne({ where: { transactionExternalId } });
    if (!transaction) return null;
    const newStatus = await statusRepo.findOne({ where: { name: status } });
    if (!newStatus) return null;
    transaction.transactionStatus = newStatus;
    await transactionRepo.save(transaction);
    return transaction;
    
  }
}
