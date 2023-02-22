import { KafkaConnection } from '../../../../Shared/infrastructure/EventBus/Kafka/KafkaConnection';
import { KafkaEventBus } from '../../../../Shared/infrastructure/EventBus/Kafka/KafkaEventBus';
import { KafkaConfig } from './KafkaConfigFactory';

export class KafkaEventBusFactory {
	static create(connection: KafkaConnection, config: KafkaConfig): KafkaEventBus {
		return new KafkaEventBus({
			connection,
			publisherTopic: config.publisherTopicSettings.name,
			consumerTopic: config.consumerTopicSettings.name
		});
	}
}
