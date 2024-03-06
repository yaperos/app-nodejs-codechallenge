export const kafkaQueueConfig = Object.freeze({
	brokers: [String(process.env.KAFKA_FIRST_BROKER)],
	transaction: {
		clientId: String(process.env.KAFKA_CLIENT_ID),
		updateTransactionTopic: String(process.env.KAFKA_UPDATE_TRANSACTION_TOPIC),
		validateTransactionTopic: String(process.env.KAFKA_VALIDATE_TRANSACTION_TOPIC),
		consumerGroupId: String(process.env.CONSUMER_TRANSACTION_API_GROUP_ID)
	}
});
