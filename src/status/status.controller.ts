import { Controller, Post, Get, Param, Body , ParseIntPipe, Delete, Patch, UseFilters } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@Controller('status')
@UseFilters(new HttpExceptionFilter())
export class StatusController {

	constructor(private statusService: StatusService){}

	@Post()
	createStatus(@Body() newStatus: CreateStatusDto ){
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
	updateStatus(@Param('id',ParseIntPipe) id: number, @Body() Status: UpdateStatusDto){
		return this.statusService.updateStatus(id, Status);
	}

}
