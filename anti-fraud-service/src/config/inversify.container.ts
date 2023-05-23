import { Container } from 'inversify';
import { Symbols } from '../@types';
import { EventStreamer } from './event.streamer.interface';
import { KafkaClient } from './kafka';
import { TransactionController } from '../modules/transaction/transaction.controller';
import { TransactionService } from '../modules/transaction/transaction.service';
import environment from '../environment';

/** Depency injection container */
const appContainer = new Container();

// Kafka Event Streamer client (Singleton)
const kafka = new KafkaClient('transaction-app', environment.KAFKA_HOST ?? '');
appContainer.bind<EventStreamer>(Symbols.EventStreamer).toConstantValue(kafka);

// Transaction (Transient)
appContainer.bind(TransactionService).toSelf();
appContainer.bind(TransactionController).toSelf();

export { appContainer };
