import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MessageUpdateDTO } from '@api/dto';
import { AntiFraudService } from '@api/service/antifraud.service';

import { EventPatternEnum } from '@source/enum/event-pattern.enum';

@Controller()
export class AntifraudController {
	constructor(private readonly antiFraudService: AntiFraudService) { }
	
	@MessagePattern(EventPatternEnum.TransactionValidation)
	async event(@Payload() payload: MessageUpdateDTO): Promise<MessageUpdateDTO> {
		Logger.log('event', AntifraudController.name);
		Logger.log(`payload: ${JSON.stringify(payload)}`, AntifraudController.name);

		return this.antiFraudService.validateTransaction(payload);
	}
}
