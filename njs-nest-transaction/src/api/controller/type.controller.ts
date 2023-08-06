import {Body, Controller, Delete, 
	Get, Inject, InternalServerErrorException, Logger,Param, Post 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { performance } from 'perf_hooks';
import { v4 as uuidv4 } from 'uuid';

import { KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { CreateTransactionDto } from '@api/dto';
import { MessageUpdateDTO } from '@api/dto/message-update.dto';
import { ObjectIdParserPipe, ObjectIdValidation } from '@api/pipes';
import { TransactionService } from '@api/service/transaction.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { round } from 'lodash';
import { EventPatternEnum } from 'src/enum/event-pattern.enum';
import { TypeService } from '@api/service';

@ApiTags('Types')
@Controller('types')
export class TypeController {
	constructor(private readonly typeService: TypeService) {
	}

	
	@Get()
	async findAll() {
		const startFull = performance.now();

		Logger.log(`[${TypeController.name}] - method: findAll`, TypeController.name);

		const startGettAll = performance.now();
		const transactions = await this.typeService.findAll();
		const endFindAll = performance.now();
		Logger.log(`[${TypeController.name}] - Find all types: [${round(endFindAll - startGettAll, 2)}] ms`, TypeController.name);

		const endFull = performance.now();

		Logger.log(`[${TypeController.name}] - Full process: [${round(endFull - startFull, 2)}] ms`, TypeController.name);

		return transactions;
	}
}
