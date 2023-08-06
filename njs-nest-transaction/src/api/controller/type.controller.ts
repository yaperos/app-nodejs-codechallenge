import { TypeService } from '@api/service';
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { round } from 'lodash';
import { performance } from 'perf_hooks';

@ApiTags('Types')
@Controller('types')
export class TypeController {
	constructor(private readonly typeService: TypeService) {}

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
