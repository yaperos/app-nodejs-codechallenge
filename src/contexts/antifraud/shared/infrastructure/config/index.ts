import convict from 'convict';

const antiFraudConfig = convict({
	env: {
		doc: 'The application environment.',
		format: ['production', 'development', 'staging', 'test'],
		default: 'default',
		env: 'NODE_ENV'
	},
	kafka: {
		connectionSettings: {
			connection: {
				hostname: {
					doc: 'Kafka hostname',
					format: String,
					env: 'KAFKA_HOSTNAME',
					default: 'localhost'
				},
				port: {
					doc: 'Kafka port',
					format: Number,
					env: 'KAFKA_PORT',
					default: 9092
				}
			}
		},
		publisherTopicSettings: {
			name: {
				doc: 'Kafka publisher topic name',
				format: String,
				env: 'KAFKA_PUBLISHER_TOPIC_NAME',
				default: 'antifraud_domain_events'
			}
		},
		consumerTopicSettings: {
			name: {
				doc: 'Kafka consumer topic name',
				format: String,
				env: 'KAFKA_CONSUMER_TOPIC_NAME',
				default: 'transaction_domain_events'
			}
		}
	}
});

antiFraudConfig.loadFile([
	`${__dirname}/default.json`,
	`${__dirname}/${antiFraudConfig.get('env')}.json`
]);

export default antiFraudConfig;
