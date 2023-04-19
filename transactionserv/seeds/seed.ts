import { createConnection } from 'typeorm';
import { YapeTransactionType } from '../src/transaction/entities/transaction-type.entity';
import { TransactionStatus } from '../src/transaction/entities/transaction-status.entity';

async function run() {
  const connection = await createConnection();

  const transactionTypeRepository = connection.getRepository(YapeTransactionType);
  const transactionTypes = [
    { name: '1' },
    { name: '2' },
    { name: '3' },
  ];

  for (const type of transactionTypes) {
    await transactionTypeRepository.save(type);
  }

  const transactionStatusRepository = connection.getRepository(TransactionStatus);
  const transactionStatuses = [
    { name: 'Transfrencia Pendiente (Pending)' },
    { name: 'Transfrencia Aprobada (Approved)' },
    { name: 'Transfrencia Rechazada (Rejected)' },
  ];

  for (const status of transactionStatuses) {
    await transactionStatusRepository.save(status);
  }

  await connection.close();
}

run()
  .then(() => console.log('Las Seeds han sido ejecutadas correctamente'))
  .catch((error) => console.error('Ha habido un error ejecutando las seeds:', error));
