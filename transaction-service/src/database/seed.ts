import { AppDataSource } from './data-source';
import { TransactionType } from '../transaction/entities/transaction-type.entity';

async function seed() {
  await AppDataSource.initialize();

  const transactionTypeRepo = AppDataSource.getRepository(TransactionType);

  const defaultTypes = [
    { transactionTypeName: 'Yape' },
    { transactionTypeName: 'Plin' },
    { transactionTypeName: 'Transferencia' },
    { transactionTypeName: 'Depósito' },
  ];

  for (const type of defaultTypes) {
    const exists = await transactionTypeRepo.findOneBy({
      transactionTypeName: type.transactionTypeName,
    });
    if (!exists) {
      await transactionTypeRepo.save(type);
    }
  }

  console.log('✅ Seed completado.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err);
});
