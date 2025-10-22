import { DataSource } from 'typeorm';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

export async function seedDatabase(dataSource: DataSource) {
  const transactionTypeRepository = dataSource.getRepository(TransactionType);
  const transactionStatusRepository =
    dataSource.getRepository(TransactionStatus);

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
    { id: 1, name: 'pending' },
    { id: 2, name: 'approved' },
    { id: 3, name: 'rejected' },
  ];

  for (const status of transactionStatuses) {
    const existingStatus = await transactionStatusRepository.findOne({
      where: { id: status.id },
    });
    if (!existingStatus) {
      await transactionStatusRepository.save(status);
    }
  }

  console.log('Database seeded successfully');
}
