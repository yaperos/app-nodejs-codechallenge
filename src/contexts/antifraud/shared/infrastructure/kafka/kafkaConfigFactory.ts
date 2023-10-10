import { ConnectionSettings } from '../../../../shared/infrastructure/eventBus/kafka/connectionSettings';
import { TopicSettings } from '../../../../shared/infrastructure/eventBus/kafka/topicSettings';
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
