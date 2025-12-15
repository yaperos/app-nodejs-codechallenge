import express from 'express';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { KafkaPublisher } from './infrastructure/kafka/kafka-publisher';
import { AntiFraudConsumer } from './infrastructure/kafka/anti-fraud-consumer';
import { CreateTransactionUseCase } from './domain/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from './domain/use-cases/get-transaction.usecase';
import { TransactionController } from './infrastructure/http/controllers/transaction.controller';

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // Infra
  const repository = new TransactionRepository();
  const kafkaPublisher = new KafkaPublisher();
  await kafkaPublisher.connect();

  // Anti-fraud consumer
  const antiFraud = new AntiFraudConsumer(repository);
  await antiFraud.connect();

  // UseCases
  const createUseCase = new CreateTransactionUseCase(repository, kafkaPublisher);
  const getUseCase = new GetTransactionUseCase(repository);

  // Controller
  const controller = new TransactionController(createUseCase, getUseCase);
  app.use('/', controller.router);

  app.listen(3000, () => console.log('Server running on port 3000'));
}

bootstrap();
