import { Container } from 'inversify';
import { Kafka } from 'kafkajs';
import { Symbols } from '../@types';
import { EventStreamer } from './event.streamer.interface';
import { KafkaClient } from './kafka';
import { TransactionController } from '../modules/transaction/transaction.controller';
import { TransactionService } from '../modules/transaction/transaction.service';
import environment from '../environment';

/** Depency injection container */
const appContainer = new Container();

// Kafka Event Streamer client (Singleton)
appContainer.bind(Kafka).toConstantValue(new Kafka({
  clientId: 'transaction-app',
  brokers: [environment.KAFKA_HOST ?? ''],
}));

// Kafka Event Streamer client (Singleton)
appContainer.bind<EventStreamer>(Symbols.EventStreamer).to(KafkaClient).inSingletonScope();

// Transaction (Transient)
appContainer.bind(TransactionService).toSelf();
appContainer.bind(TransactionController).toSelf();

export { appContainer };
