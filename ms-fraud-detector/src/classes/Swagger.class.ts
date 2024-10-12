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
    .setTitle('Yape Fraud Detector Micro-service')
    .setDescription('Validate each transaction looking for possible frauds')
    .setVersion('1.0')
    .build();

		const document = SwaggerModule.createDocument(appInstance, config);

		SwaggerModule.setup('docs', appInstance, document);
	}
}