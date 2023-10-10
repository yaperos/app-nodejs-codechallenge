import { KafkaConnection } from '../../../../shared/infrastructure/eventBus/kafka/kafkaConnection';
import { KafkaEventBus } from '../../../../shared/infrastructure/eventBus/kafka/kafkaEventBus';
import { KafkaConfig } from './kafkaConfigFactory';

export class KafkaEventBusFactory {
	static create(connection: KafkaConnection, config: KafkaConfig): KafkaEventBus {
		return new KafkaEventBus({
			connection,
			publisherTopic: config.publisherTopicSettings.name,
			consumerTopic: config.consumerTopicSettings.name
		});
	}
}
