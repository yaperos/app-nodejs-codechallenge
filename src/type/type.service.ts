import { Injectable , HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './type.entity';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'

 
@Injectable()
export class TypeService {


	constructor(@InjectRepository(Type) private typeRepository: Repository<Type> ) {}

	async createType(type: CreateTypeDto ){
		const typeFound = await this.typeRepository.findOne({
			where:{
				name: type.name
			}
		});

		if( typeFound ){
			return new HttpException('Type already exists',HttpStatus.CONFLICT)
		}

		const newType = this.typeRepository.create(type);
	 
		return this.typeRepository.save(newType)
	}

	getTypes(){
		return this.typeRepository.find()
	}

	async getType(id: number){
		const typeFound = await this.typeRepository.findOne({
			where:{
				id: id
			}
		});

		if(!typeFound){
			return new HttpException('Type not found',HttpStatus.NOT_FOUND)

		}
		return typeFound;
	}

	deleteType(id: number){
		// TODO validar constratint con Transaction
		return this.typeRepository.delete({id});
	}

	updateType(id: number, type: UpdateTypeDto){
		return this.typeRepository.update({id: id}, type);
    }

}
