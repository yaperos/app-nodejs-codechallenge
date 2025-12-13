import { DataSource } from 'typeorm';
import { TransactionType } from '../entities/TransactionType';
import { TransactionStatus } from '../entities/TransactionStatus';
import * as fs from 'fs';
import * as path from 'path';

export async function seedCatalogs(dataSource: DataSource) {
  // Seed Transaction Types
  const typesPath = path.join(__dirname, 'transaction-types.json');
  const typesData = JSON.parse(fs.readFileSync(typesPath, 'utf-8'));
  for (const type of typesData) {
    const exists = await dataSource.getRepository(TransactionType).findOneBy({ name: type.name });
    if (!exists) {
      const newType = dataSource.getRepository(TransactionType).create(type);
      await dataSource.getRepository(TransactionType).save(newType);
    }
  }

  // Seed Transaction Statuses
  const statusesPath = path.join(__dirname, 'transaction-statuses.json');
  const statusesData = JSON.parse(fs.readFileSync(statusesPath, 'utf-8'));
  for (const status of statusesData) {
    const exists = await dataSource.getRepository(TransactionStatus).findOneBy({ name: status.name });
    if (!exists) {
      const newStatus = dataSource.getRepository(TransactionStatus).create(status);
      await dataSource.getRepository(TransactionStatus).save(newStatus);
    }
  }
  console.log('Catálogos cargados correctamente.');
}

// Ejecución directa si se llama el script
if (require.main === module) {
  import('../config/data-source').then(({ AppDataSource }) => {
    AppDataSource.initialize()
      .then(async () => {
        await seedCatalogs(AppDataSource);
        await AppDataSource.destroy();
      })
      .catch((error) => {
        console.error('Error al cargar catálogos:', error);
        process.exit(1);
      });
  });
}
