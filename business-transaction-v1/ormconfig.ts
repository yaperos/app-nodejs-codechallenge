import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Transaction } from './src/transactions/transaction.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'transaction_db',
  entities: [Transaction],
  
  // ✅ Para desarrollo - TypeORM maneja automáticamente las tablas
  synchronize: process.env.NODE_ENV === 'development',
  
  // ❌ Sin migraciones por ahora (comentado hasta que se necesiten)
  // migrations: ['dist/src/migrations/*.js'],
  // migrationsRun: false,
  // migrationsTableName: 'typeorm_migrations',
  
  // Configuración adicional
  schema: 'trx', // Schema por defecto
  logging: ['error', 'warn'], // Removido 'migration' ya que no hay migraciones
  
  // SSL para producción
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};