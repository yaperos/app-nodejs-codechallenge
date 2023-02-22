import { ConnectionSettings } from '../../../../Shared/infrastructure/EventBus/Kafka/ConnectionSettings';
import { TopicSettings } from '../../../../Shared/infrastructure/EventBus/Kafka/TopicSettings';
import config from '../config';

export type KafkaConfig = {
	connectionSettings: ConnectionSettings;
	consumerTopicSettings: TopicSettings;
	publisherTopicSettings: TopicSettings;
};
export class KafkaConfigFactory {
	static createConfig(): KafkaConfig {
		return config.get('kafka');
	}
}
