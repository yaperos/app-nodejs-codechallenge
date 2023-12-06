import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3015);
}
bootstrap();
