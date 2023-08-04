import {Kafka} from "kafkajs";
import { IKafkaConfig } from '../providers/kafka/IKafka'

export class KafkaConfig{

    protected tempClientID:string;
    protected tempBroker:string;
    protected kafkaBrokers:Array<string>;
    protected kafkaTemp:Kafka;
    protected kafkaGroupID:string;
    protected consumerID:string;
    constructor() {
        this.tempClientID = process.env.KAFKA_CLIENT_ID || 'transaction';
        this.tempBroker = process.env.KAFKA_BROKERS||'localhost:9092';
        this.kafkaBrokers = this.tempBroker.split(';');
        this.kafkaGroupID = process.env.KAFKA_GROUP_ID||'antifraud-group';
        this.consumerID = process.env.KAFKA_CONSUMER_ID||'antifraud';
        this.kafkaTemp = new Kafka({
            clientId: this.tempClientID,
            brokers: this.kafkaBrokers
        });
    }
    getKafka(){
        return this.kafkaTemp;
    }

    getConfig():IKafkaConfig{
        return {
            clientId: this.tempClientID,
            brokers: this.kafkaBrokers,
            groupID: this.kafkaGroupID,
            consumerID: this.consumerID
        }
    }
}