import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class Swagger {

	/**
	 * 
	 * @param appInstance
	 * Set API documentation using swagger
	 */
	public static config(appInstance: INestApplication) {
		const config = new DocumentBuilder()
    .setTitle('Yape Transactions Micro-service')
    .setDescription('Manage all transactions operations')
    .setVersion('1.0')
    .addTag('transactions')
    .build();

		const document = SwaggerModule.createDocument(appInstance, config);

		SwaggerModule.setup('docs', appInstance, document);
	}
}