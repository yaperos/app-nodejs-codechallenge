import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject('TRANSACTION_SERVICE')
		private readonly transactionClient: ClientKafka
	) {}

	@EventPattern('fraud_detection_request')
	fraudDetectionRequest(data: any) {
		console.log('fraud_detection_request:',data);
		const status = this.appService.detectFraud(data);
		this.transactionClient.emit('fraud_detection_response', {id: data.id, status});
	}
	
}
