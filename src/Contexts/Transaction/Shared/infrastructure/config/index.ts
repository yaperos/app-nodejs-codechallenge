/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import convict from 'convict';

const transactionConfig = convict({
	env: {
		doc: 'The application environment.',
		format: ['production', 'development', 'staging', 'test'],
		default: 'default',
		env: 'NODE_ENV'
	},
	typeorm: {
		host: {
			doc: 'The database host',
			format: String,
			env: 'TYPEORM_HOST',
			default: 'localhost'
		},
		port: {
			doc: 'The database port',
			format: Number,
			env: 'TYPEORM_PORT',
			default: 5432
		},
		username: {
			doc: 'The database username',
			format: String,
			env: 'TYPEORM_USERNAME',
			default: 'postgres'
		},
		password: {
			doc: 'The database password',
			format: String,
			env: 'TYPEORM_PASSWORD',
			default: 'password'
		},
		database: {
			doc: 'The database name',
			format: String,
			env: 'TYPEORM_DATABASE',
			default: 'transaction-dev'
		}
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
				default: 'transaction_domain_events'
			}
		},
		consumerTopicSettings: {
			name: {
				doc: 'Kafka consumer topic name',
				format: String,
				env: 'KAFKA_CONSUMER_TOPIC_NAME',
				default: 'antifraud_domain_events'
			}
		}
	}
});

transactionConfig.loadFile([
	`${__dirname}/default.json`,
	`${__dirname}/${transactionConfig.get('env')}.json`
]);
export default transactionConfig;
