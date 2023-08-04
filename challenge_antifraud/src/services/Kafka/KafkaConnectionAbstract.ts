import { KafkaDrive }  from "../../providers/kafka/Kafka"
import {IKafkaMessage} from "../../providers/kafka/IKafka";
import {RecordMetadata, Consumer } from 'kafkajs';

export abstract class KafkaConnectionService{
    protected kafkaDrive:KafkaDrive;

    constructor(iKafkaMessage?:IKafkaMessage) {
        this.kafkaDrive = new KafkaDrive(iKafkaMessage);
    }

    abstract producer():Promise<RecordMetadata[]|undefined>;
    abstract consumer():Promise<Consumer>;
}