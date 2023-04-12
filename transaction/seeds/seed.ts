// seeds/seed.ts
import { createConnection } from 'typeorm';
import { TransactionType } from '../src/transaction/entities/transaction-type.entity';
import { TransactionStatus } from '../src/transaction/entities/transaction-status.entity';

async function run() {
  const connection = await createConnection();

  // Seed TransactionType
  const transactionTypeRepository = connection.getRepository(TransactionType);
  const transactionTypes = [
    { name: 'tipotransaccion1' },
    { name: 'tipotransaccion2' },
    { name: 'tipotransaccion3' },
  ];

  for (const type of transactionTypes) {
    await transactionTypeRepository.save(type);
  }

  // Seed TransactionStatus
  const transactionStatusRepository = connection.getRepository(TransactionStatus);
  const transactionStatuses = [
    { name: 'Pendiente' },
    { name: 'Aprobado' },
    { name: 'Rechazado' },
  ];

  for (const status of transactionStatuses) {
    await transactionStatusRepository.save(status);
  }

  await connection.close();
}

run()
  .then(() => console.log('Seeds executed successfully'))
  .catch((error) => console.error('Error executing seeds:', error));
