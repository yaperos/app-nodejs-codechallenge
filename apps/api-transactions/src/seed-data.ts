import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TransactionStatus } from './transaction/entities/transactionStatus.entity';
import { TransactionType } from './transaction/entities/transactionType.entity';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    entities: [TransactionStatus, TransactionType],
    synchronize: true,
    // logging: true,
    // subscribers: [],
    // migrations: [],
  });

  await dataSource.initialize();

  const statusRepository = dataSource.getRepository(TransactionStatus);
  const typeRepository = dataSource.getRepository(TransactionType);

  const statuses = [
    { name: 'pendient' },
    { name: 'approved' },
    { name: 'rejected' },
  ];
  const types = [{ name: 'transfer' }];

  try {
    const insertedStatus = await statusRepository.save(statuses);
    console.log(insertedStatus);
    console.log('✅', '-------Transaction Statuses inserted-------');
    const insertTypes = await typeRepository.save(types);
    console.log(insertTypes);
    console.log('✅', '-------Transaction Types inserted-------');
  } catch (error) {
    console.log(error.message);
  }
}
bootstrap();
