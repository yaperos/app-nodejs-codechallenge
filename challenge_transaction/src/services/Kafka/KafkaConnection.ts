import { KafkaConnectionService } from './KafkaConnectionAbstract';

export class KafkaConnection extends KafkaConnectionService{
    producer() {
        return this.kafkaDrive.producer();
    }

    consumer(){
        return this.kafkaDrive.consumer();
    }
}