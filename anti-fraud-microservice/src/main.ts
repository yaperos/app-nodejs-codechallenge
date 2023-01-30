import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import config from 'config/configuration';

async function bootstrap() {

	const broker = config().broker;
	console.log(broker);

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.KAFKA,
			options: {
				client: {
					brokers: [broker],
				},
				consumer: {
					groupId: 'antifraud-consumer',
				},
			},
		},
	);
	app.listen();
}

bootstrap();
