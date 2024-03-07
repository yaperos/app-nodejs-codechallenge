import { Controller, Post, Get, Param, Body , ParseIntPipe, Delete, Patch, UseFilters } from '@nestjs/common';
import { StatusDto } from './dto/status.dto';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@Controller('status')
@UseFilters(new HttpExceptionFilter())
export class StatusController {

	constructor(private statusService: StatusService){}

	@Post()
	createStatus(@Body() newStatus: StatusDto ){
		return this.statusService.createStatus(newStatus)
	}

	@Get()
	getStatuss(): Promise<Status[]> {
		return this.statusService.getAllStatus()
	}


	@Get(':id')
	getStatus(@Param('id', ParseIntPipe) id: number ){
		return this.statusService.getStatus(id)
	}

	@Delete(':id')
	deleteStatus(@Param('id',ParseIntPipe) id: number){
		return this.statusService.deleteStatus(id)
	}


	@Patch(':id')
	updateStatus(@Param('id',ParseIntPipe) id: number, @Body() status: StatusDto){
		return this.statusService.updateStatus(id, status);
	}

}
