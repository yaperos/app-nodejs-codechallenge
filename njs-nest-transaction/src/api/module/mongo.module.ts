import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const TransactionMongooseModule = MongooseModule.forRootAsync({
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => ({
		uri: configService.get<string>('mongo.uri'),
		dbName: configService.get<string>('mongo.dbName'),
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}),
	inject: [ConfigService],
});

export const TransactionMongooseModuleTest = MongooseModule.forRootAsync({
	imports: [ConfigModule],
	useFactory: async (_configService: ConfigService) => ({
		uri: 'mongodb://localhost:27017/test',
	}),
	inject: [ConfigService],
});