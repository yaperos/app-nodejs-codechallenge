import { TransactionType } from 'src/transaction-type/entities/transaction-type.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TransactionTypeSeeder1683318990 implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const transactionTypeRepository = dataSource.getRepository(TransactionType);

    const types = transactionTypeRepository.create([
      {
        name: 'Envío de dinero',
      },
      {
        name: 'Pago de servicios',
      },
      {
        name: 'Compra de productos',
      },
      {
        name: 'Retiro de efectivo',
      },
      {
        name: 'Recarga de celular',
      },
      {
        name: 'Donaciones',
      },
    ]);

    await transactionTypeRepository.save(types);
  }
}
