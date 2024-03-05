import { Controller, Post, Get, Param, Body , ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypeService } from './type.service';
import { Type } from './type.entity';



@Controller('type')
export class TypeController {

	constructor(private typesService: TypeService){}

	@Post()
	createType(@Body() newType: CreateTypeDto ){
		return this.typesService.createType(newType)
	}

	@Get()
	getTypes(): Promise<Type[]> {
		return this.typesService.getTypes()
	}


	@Get(':id')
	getType(@Param('id', ParseIntPipe) id: number ){
		return this.typesService.getType(id)
	}

	@Delete(':id')
	deletetype(@Param('id',ParseIntPipe) id: number){
		return this.typesService.deleteType(id)
	}


	@Patch(':id')
	updatetype(@Param('id',ParseIntPipe) id: number, @Body() type: UpdateTypeDto){
		return this.typesService.updateType(id, type);
	}

}
