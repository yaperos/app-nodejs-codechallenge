import { kafkaService } from '../../services';
import { ListenKafka } from './ListenKafka';

const listenKafka = new ListenKafka(kafkaService);

export { listenKafka };
