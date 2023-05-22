import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { Symbols } from '../@types';
import { EventStreamer } from './event.streamer.interface';
import { KafkaClient } from './kafka';
import { TransactionController } from '../modules/transaction/transaction.controller';
import { TransactionService } from '../modules/transaction/transaction.service';

const appContainer = new Container();

// Prisma client (Singleton)
appContainer.bind(PrismaClient).toConstantValue(new PrismaClient());

// Kafka Event Streamer client (Singleton)
const kafka = new KafkaClient('transaction-app', process.env.KAFKA_HOST_URL ?? '');
appContainer.bind<EventStreamer>(Symbols.EventStreamer).toConstantValue(kafka);

// Transaction (Transient)
appContainer.bind(TransactionService).toSelf();
appContainer.bind(TransactionController).toSelf();

export { appContainer };
