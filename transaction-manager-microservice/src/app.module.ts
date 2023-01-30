import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLCustomModule } from './graphql/graphql.module';
import config from 'config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config]
		}),
		GraphQLCustomModule
	]
})

export class AppModule {}