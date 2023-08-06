import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import kafkaConfig from './kafka.config';

describe('pgConfig', () => {
	let config: ConfigType<typeof kafkaConfig>;

	beforeEach(async () => {
		process.env.KAFKA_BROKER_HOST = 'localhost';
		process.env.KAFKA_BROKER_PORT = '9092';
		
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
		expect(config.host).toBeDefined();
		expect(config.port).toBeDefined();
	});
});
