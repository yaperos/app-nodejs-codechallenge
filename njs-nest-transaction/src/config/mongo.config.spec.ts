import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import pgConfig from './mongo.config';

describe('pgConfig', () => {
	let config: ConfigType<typeof pgConfig>;

	beforeEach(async () => {
		process.env.MONGO_URI = 'mongodb://localhost:27017';
		process.env.MONGO_DB_NAME = 'test';

		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(pgConfig)],
		}).compile();

		config = module.get<ConfigType<typeof pgConfig>>(pgConfig.KEY);
	});

	it('should be defined', () => {
		expect(pgConfig).toBeDefined();
	});

	it('should contains token and version for vault', async () => {
		expect(config).toBeDefined();
		expect(config.uri).toEqual('mongodb://localhost:27017');
		expect(config.dbName).toEqual('test');
	});
});
