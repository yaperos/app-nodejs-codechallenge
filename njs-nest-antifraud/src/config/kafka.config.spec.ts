import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import kafkaConfig from './kafka.config';

describe('pgConfig', () => {
	let config: ConfigType<typeof kafkaConfig>;

	beforeEach(async () => {
		process.env.KAFKA_BROKERS = 'kafka:9092,kafka:9093,kafka:9094';
		
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(kafkaConfig)],
		}).compile();

		config = module.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);
	});

	it('should be defined', () => {
		expect(kafkaConfig).toBeDefined();
	});

	it('should contains right values', () => {
		expect(config).toBeDefined();
		expect(config.brokers).toBeDefined();
		expect(config.brokers).toEqual('kafka:9092,kafka:9093,kafka:9094');
	});

	it('should take default values if not provided', async () => {
		process.env.KAFKA_BROKERS = '';

		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(kafkaConfig)],
		}).compile();

		config = module.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);

		expect(config).toBeDefined();
		expect(config.brokers).toBeDefined();
		expect(config.brokers).toEqual('kafka1:9092,kafka2:9092,kafka3:9092');
	});
});
