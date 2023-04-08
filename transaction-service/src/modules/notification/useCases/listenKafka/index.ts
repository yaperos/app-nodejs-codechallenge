import { kafkaService } from '../../services';
import { ListenKafka } from './ListenKafka';

const listenKafka = new ListenKafka(kafkaService);
listenKafka.execute();

export { listenKafka };
