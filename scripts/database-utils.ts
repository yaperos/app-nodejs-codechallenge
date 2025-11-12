import { DataSource } from 'typeorm';
import { TransactionType } from '../src/database/entities/transaction-type.entity';
import { TransactionStatus } from '../src/database/entities/transaction-status.entity';

export async function prePopulateDatabase(dataSource: DataSource) {
  const transactionTypeRepository = dataSource.getRepository(TransactionType);
  const transactionStatusRepository = dataSource.getRepository(TransactionStatus);

  const transactionTypes = [
    { id: 1, name: 'Transfer' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Withdrawal' },
  ];

  for (const type of transactionTypes) {
    const existingType = await transactionTypeRepository.findOne({
      where: { id: type.id },
    });
    if (!existingType) {
      await transactionTypeRepository.save(type);
    }
  }

  const transactionStatuses = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' },
  ];

  for (const status of transactionStatuses) {
    const existingStatus = await transactionStatusRepository.findOne({
      where: { id: status.id },
    });
    if (!existingStatus) {
      await transactionStatusRepository.save(status);
    }
  }
  console.log('Database pre-populate successfully');
}
