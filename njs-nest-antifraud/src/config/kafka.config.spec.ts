import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import kafkaConfig from './kafka.config';

describe('pgConfig', () => {
	let config: ConfigType<typeof kafkaConfig>;

	beforeEach(async () => {
		process.env.KAFKA_BROKERS = 'kafka:9092,kafka:9093kafka:9094';
		
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(kafkaConfig)],
		}).compile();

		config = module.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);
	});

	it('should be defined', () => {
		expect(kafkaConfig).toBeDefined();
	});

	it('should contains token and version for vault', async () => {
		expect(config).toBeDefined();
		expect(config.brokers).toBeDefined();
		expect(config.brokers).toEqual('kafka:9092,kafka:9093kafka:9094');
	});
});
