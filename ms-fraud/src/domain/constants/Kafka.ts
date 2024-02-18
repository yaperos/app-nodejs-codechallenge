export enum KafkaConstants{
    DEFAULT_CLIENTID = "fraud",
    DEFAULT_BROKER = "localhost:9092",
    TRANSACTION_PENDGING_TOPIC = 'transaction-pending',
    TRANSACTION_EVALUATED_TOPIC = 'transaction-evaluated',
    GROUP_ID = 'fraud-group'
}